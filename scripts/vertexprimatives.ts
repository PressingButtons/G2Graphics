import { PolygonalVertex } from "../classes/polygonalvertex.ts";
import { G2Enum } from "../g2enum.ts";

export namespace PrimativeVertex {

    export function ColorRect( gl:WebGL2RenderingContext, program:WebGLProgram ) {
        return new PolygonalVertex(gl, program, new Int8Array([-1, -1, 1, -1, 1, 1, -1, 1]));
    }

    export function TextureRect(gl:WebGL2RenderingContext, program:WebGLProgram) {
        return new PolygonalVertex(gl, program, new Int8Array([
            -1, -1, 0, 0, 
             1, -1, 1, 0, 
            -1,  1, 0, 1, 
             1,  1, 1, 1
        ]));
    }

    export function ColorCirlce(gl:WebGL2RenderingContext, program:WebGLProgram) {

        let data = new Array(G2Enum.VERTEX_CIRCLE).fill(0).map((x, i) => {
            const theta = i * 2 * Math.PI / G2Enum.VERTEX_CIRCLE;
            return [Math.cos(theta), Math.sin(theta)]
        }).flat( );


        let circle = new PolygonalVertex(gl, program, new Float32Array(data));
        circle.setAttribute(gl, {
            name: 'a_position',
            type: gl.FLOAT,
            size: 2,
            stride: 2,
            offset: 0,
            buffer: circle.shape.buffer
        });

        return circle;
    }

}