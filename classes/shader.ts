import { Compiler } from "../scripts/compiler.ts";
import { mat4 } from "../scripts/glmatrix";

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

type MatrixAttribute = Omit<SingleAttribute, "size">;

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
        if(location != - 1) {
            gl.bindVertexArray(this.vertex);
            gl.bindBuffer(gl.ARRAY_BUFFER, config.buffer);
            for(let i = 0; i < config.iterations; i++) {
                location += i;
                gl.enableVertexAttribArray(location);
                gl.vertexAttribPointer(location, config.size, config.type, false, config.stride, config.offset);
                gl.vertexAttribDivisor(location, 1);
            }
        }
    }

    setMatrixAttribute( config: MatrixAttribute ) {
        let location = gl.getAttribLocation(this.shader.program, config.name);
        if(location != - 1) {
            gl.bindVertexArray(this.vertex);
            gl.bindBuffer(gl.ARRAY_BUFFER, config.buffer);
            for(let i = 0; i < 4; i++) {
                location += i;
                gl.enableVertexAttribArray(location);
                gl.vertexAttribPointer(location, 4, config.type, false, config.stride, config.offset);
                gl.vertexAttribDivisor(location, 1);
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

    update(buffer:ArrayBuffer) {
        const count = (buffer.byteLength - 2) / 32;
        const blocks = new Array(count).fill(0).map((x, i) => {
            const offset = 2 + 32 * i;
            const rotation = new Float32Array(buffer, offset, 3);
            const [depth, scheme] = new Uint8Array(buffer, offset + 12, 2);
            const color = new Uint8Array(buffer, offset + 14, 4);
            const position = new Int16Array(buffer, offset + 18, 3);
            const scale = new Int16Array(buffer, offset + 24, 3);
            // now actually update the buffer
            const bufferData = this.data as Float32Array;
            const subset = bufferData.subarray(i * 22, i * 22 + 22);
            mat4.fromTranslation(subset, [...position] as Trio);
            mat4.rotate(subset, rotation);
            mat4.scale(subset, [...scale].map(x => x / 200) as Trio);
            subset.set([...color].map(x => x / 255) as Quad, 16);
            subset[20] = depth;
            subset[21] = scheme;
        });
        return count;
    }
    
}