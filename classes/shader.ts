import { Compiler } from "../scripts/compiler.ts";
import { mat4 } from "../scripts/glmatrix.ts";
import { DrawableBaseSize, DrawableBlockSize } from "./drawable.ts";

let gl:WebGL2RenderingContext;

export class Shader {

    static create(context:WebGL2RenderingContext, vertex:string, fragment:string) {
        if(!gl) gl = context;
        const program = Compiler(gl, vertex, fragment);
        return new Shader(program);
    }

    private _program:WebGLProgram;
    private _vertices:{[key:string]: ShaderVertex}
    private _transform:TransformBuffer;
    private _uprojection:WebGLUniformLocation;

    private constructor( program:WebGLProgram ) {
        this._program = program;
        this._vertices = { };
        this._transform = new TransformBuffer( );
        this._transform.setData(new Float32Array(3200), gl.DYNAMIC_DRAW);
        this._uprojection = gl.getUniformLocation(program, 'u_projection') as WebGLUniformLocation;
    }

    get transform( ) {
        return this._transform;
    }

    get program( ) {
        return this._program
    }

    createVertex(name:string) {
        this._vertices[name] = new ShaderVertex(this);
        return this._vertices[name];
    }

    draw(type:string, projection:Float32Array, data:ArrayBufferLike) {
        gl.useProgram(this.program);
        gl.uniformMatrix4fv(this._uprojection, false, projection);
        this._transform.modifyData(data);
        if(this._vertices[type]) {
            this._vertices[type].draw(data);
        }
    }

}

type SingleAttribute = {
    name:string;
    type:GLenum;
    size:(1 | 2 | 3 | 4);
    stride:number;
    offset:number;
    buffer:WebGLBuffer;
}

interface MultiAttribute extends SingleAttribute {
    iterations:(2 | 3 | 4);
} 

type MatrixAttribute = Omit<SingleAttribute, "size" | "type">;

class ShaderVertex {

    private _shader:Shader;
    private _model:ShaderBuffer;
    private _vertex:WebGLVertexArrayObject

    constructor( shader:Shader ) {
        this._shader = shader;
        this._model = new ShaderBuffer( );
        this._vertex = gl.createVertexArray( );
    }

    get shader( ) {
        return this._shader;
    }

    get model( ) {
        return this._model;
    }
    
    get vertex( ) {
        return this._vertex;
    }

    setAttribute( config:SingleAttribute ) {
        const location = gl.getAttribLocation(this.shader.program, config.name);
        if(location != - 1) {
            gl.bindVertexArray(this.vertex);
            gl.bindBuffer(gl.ARRAY_BUFFER, config.buffer);
            gl.enableVertexAttribArray(location);
            gl.vertexAttribPointer(location, config.size, config.type, false, config.stride, config.offset);
        }
    }

    setMultiAttribute( config:MultiAttribute ) {
        let location = gl.getAttribLocation(this.shader.program, config.name);
        if(location > -1) {
            gl.bindVertexArray(this.vertex);
            gl.bindBuffer(gl.ARRAY_BUFFER, config.buffer);
            for(let i = 0; i < config.iterations; i++) {
                gl.enableVertexAttribArray(location + i);
                gl.vertexAttribPointer(location + i, config.size, config.type, false, config.stride, config.offset);
                gl.vertexAttribDivisor(location + i, 1);
            }
        }
    }

    setMatrixAttribute( config: MatrixAttribute ) {
        let location = gl.getAttribLocation(this.shader.program, config.name);
        if(location > -1) {
            gl.bindVertexArray(this.vertex);
            gl.bindBuffer(gl.ARRAY_BUFFER, config.buffer);
            for(let i = 0; i < 4; i++) {
                gl.enableVertexAttribArray(location + i);
                gl.vertexAttribPointer(location + i, 4, gl.FLOAT, false, config.stride, config.offset + (i * 16));
                gl.vertexAttribDivisor(location + i, 1);
            }
        }
    }

    draw(data:ArrayBufferLike) {

    }

}

class ShaderBuffer {

    private _buffer:WebGLBuffer;
    private _data:ArrayBufferLike | null;

    constructor( ) {
        this._buffer = gl.createBuffer( );
        this._data = null;
    }

    get buffer( ) {
        return this._buffer;
    }

    get data( ) {
        return this._data;
    }

    setData(data:ArrayBufferLike, usage:GLenum) {
        this._data = data;
        gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, usage);
    }

    modifyData(data:ArrayBufferLike, offset:number = 0) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, offset, data);
    }

}

class TransformBuffer extends ShaderBuffer {

    constructor( ) {
        super( );
    }

    get bufferData( ) {
        return this.data as Float32Array;
    }

    private _getViews(buffer:ArrayBuffer, offset:number) {
        const view = new Float32Array(buffer, offset, DrawableBlockSize / 4);
        return {
            view,
            position: view.subarray(0, 3).map(Math.round),
            rotation: view.subarray(3, 6),
            scale:    view.subarray(6, 9).map(Math.round),
            color:    view.subarray(9, 13),
            depth:    view[13],
            scheme:   view[14],
        }
    }

    private _updateChunk(buffer:ArrayBuffer, i:number) {
        const offset = DrawableBaseSize + DrawableBlockSize * i;
        const subset = this.bufferData.subarray(i * 22, i * 22 + 22);
        const views  = this._getViews(buffer, offset);
        mat4.fromTranslation(subset, views.position);
        mat4.rotate(subset, views.rotation);
        mat4.scale(subset, views.scale);
        subset.set(views.color, 16);
        subset[20] = views.depth;
        subset[21] = views.scheme;
    }

    update(buffer:ArrayBuffer) {
        const count = (buffer.byteLength - DrawableBaseSize) / DrawableBlockSize;
        if(count < 1) return 0;
        new Array(count).fill(buffer).map(this._updateChunk.bind(this));
        this.modifyData(this.bufferData, 0);
        return count;
    }
    
}