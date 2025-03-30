import { G2Enum } from "../g2enum.ts";
import { Compiler } from "../scripts/compiler.ts";
import { PrimativeVertex } from "../scripts/vertexprimatives.ts";
import { colorF, colorV } from "../shadersrc.ts";

export function ColorShader( gl:WebGL2RenderingContext ):ShaderProgram {

    const program = Compiler(gl, colorV, colorF);
    const uprojection = gl.getUniformLocation(program, 'u_projection');

    const shaders = {
        [G2Enum.VERTEX_RECTANGLE]:PrimativeVertex.ColorRect(gl, program),
        [G2Enum.VERTEX_CIRCLE]:PrimativeVertex.ColorCirlce(gl, program)
    }

    shaders[G2Enum.VERTEX_RECTANGLE].setAttribute(gl, {
        name: 'a_position',
        type: gl.BYTE,
        size: 2,
        stride: 2,
        offset: 0,
        buffer:shaders[G2Enum.VERTEX_RECTANGLE].shape.buffer
    });

    function draw(header:Uint16Array, data:Float32Array) {
        const vertexShape = header[1];
        const renderType  = header[2];
        let mode:GLenum;
        switch(vertexShape) {
            case G2Enum.VERTEX_RECTANGLE:
                shaders[vertexShape].activate(gl);
                mode = gl.TRIANGLE_FAN;
                if(renderType == G2Enum.RENDER_LINE) mode = gl.LINE_LOOP;
                gl.drawArraysInstanced(mode, 0, G2Enum.VERTEX_RECTANGLE, shaders[vertexShape].setPolygons(header, data));
            break;
            case G2Enum.VERTEX_CIRCLE:
                shaders[vertexShape].activate(gl);
                mode = gl.TRIANGLE_FAN;
                if(renderType == G2Enum.RENDER_LINE) mode = gl.LINE_LOOP;
                gl.drawArraysInstanced(mode, 0, G2Enum.VERTEX_CIRCLE, shaders[vertexShape].setPolygons(header, data));
            break;
        }
    }

    return function(header:Uint16Array, data:Float32Array, projection:Float32Array) {
        gl.useProgram(program);
        gl.uniformMatrix4fv(uprojection, false, projection);
        draw(header, data);
    }
}
