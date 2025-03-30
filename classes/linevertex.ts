import { BufferObject } from "./buffer.ts";
import { Vertex } from "./vertex.ts";

const INSTANCE_LENGTH = 8;
const CHUNK_LENGTH =4;

export class LineVertex extends Vertex {

    coord:BufferObject;
    color:BufferObject;

    constructor( gl:WebGL2RenderingContext, program:WebGLProgram ) {
        super(gl, program);
        this.coord = new BufferObject(gl, new Float32Array(4 * 100), gl.DYNAMIC_DRAW);
        this.color = new BufferObject(gl, new Float32Array(4 * 100), gl.DYNAMIC_DRAW);
        this.#init(gl);
    }
    
    #init(gl:WebGL2RenderingContext) {
        this.setAttribute(gl, {
            name:'a_position',
            type:gl.FLOAT,
            size:2,
            stride:2,
            offset:0,
            buffer:this.coord.buffer
        });

        this.setMultiAttribute(gl, {
            name:'a_color',
            type:gl.FLOAT,
            size:4,
            stride:4,
            offset:0,
            buffer:this.color.buffer,
            iterations:4
        })
    }

    setLines( data:Float32Array ) {
        const count = data.length / INSTANCE_LENGTH;
        for(let i = 0; i < count; i++) {
            const start = i * CHUNK_LENGTH;
            this.coord.subdata(data.subarray(start, start + 4), start);
            this.color.subdata(data.subarray(start + 4, start + 8), start);
        }
        return count;
    }

}