import { mat4 } from "../scripts/glmatrix.ts";
import { BufferObject } from "./buffer.ts";
import { Vertex } from "./vertex.ts";

const INSTANCE_LENGTH = 13;
const CHUNK_LENGTH = 22;

export class PolygonalVertex extends Vertex {

    shape:BufferObject;
    transform:BufferObject;

    constructor( gl:WebGL2RenderingContext, program:WebGLProgram, vertex:(Int8Array | Int16Array | Float32Array)) {
        super(gl, program);
        this.shape = new BufferObject(gl, vertex, gl.STATIC_DRAW);
        this.transform = new BufferObject(gl, new Float32Array(CHUNK_LENGTH * 100), gl.DYNAMIC_DRAW);
        this.#init(gl);
    }

    #init(gl:WebGL2RenderingContext) {
        this.setMatrixAttribute(gl, {
            name:'a_transform',
            stride: 22,
            offset: 0,
            buffer:this.transform.buffer
        });

        this.setMultiAttribute(gl, {
            name:'a_color',
            type:gl.FLOAT,
            size:4,
            stride:22,
            offset:16,
            iterations:4,
            buffer:this.transform.buffer
        });

        // depth and palette scheme added as needed outside init
    }

    setPolygons( header:Uint16Array, data:Float32Array ) {
        const count = data.length / 13;
        for(let i = 0; i < count; i++) {
            const source = data.subarray(i * INSTANCE_LENGTH, i * INSTANCE_LENGTH + INSTANCE_LENGTH);
            const chunk  = this.transform.slice(i * CHUNK_LENGTH, i * CHUNK_LENGTH + CHUNK_LENGTH) as Float32Array;
            mat4.fromTranslation(chunk, [...source.subarray(0, 2), 0] as Trio);
            mat4.rotate(chunk, [...source.subarray(2, 5)] as Trio);
            mat4.scale(chunk, [source[5] * header[5], source[6] * header[6], 1] as Trio);
            chunk.set(source.subarray(7, 14), 16);
        }
        //console.log(this.transform.slice(0, count * 22));
        this.transform.refresh( );
        return count;
    }

}