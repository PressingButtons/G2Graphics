import { G2Enum } from "../g2enum.ts";
import { Compiler } from "../scripts/compiler.ts";
import { TextureLib } from "../scripts/texturelib.ts";
import { PrimativeVertex } from "../scripts/vertexprimatives.ts";
import { textureF, textureV } from "../shadersrc.ts";

export function TextureShader( gl:WebGL2RenderingContext ):ShaderProgram {

    const program = Compiler(gl, textureV, textureF);
    const uprojection = gl.getUniformLocation(program, 'u_projection');
    const utexture = gl.getUniformLocation(program, 'u_texture') as WebGLUniformLocation;

    const rect = PrimativeVertex.TextureRect(gl, program);

    rect.setAttribute(gl, {
        name: 'a_position',
        type: gl.BYTE,
        size: 2,
        stride: 4,
        offset: 0,
        buffer:rect.shape.buffer
    });

    rect.setAttribute(gl, {
        name: 'a_texcoord',
        type: gl.BYTE,
        size: 2,
        stride: 4,
        offset: 2,
        buffer:rect.shape.buffer
    })

    return function(header:Uint16Array, data:Float32Array, projection:Float32Array) {
        gl.useProgram(program);
        gl.uniformMatrix4fv(uprojection, false, projection);
        rect.activate(gl);
        TextureLib.use(header[3], utexture, 0);
        gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, G2Enum.VERTEX_RECTANGLE, rect.setPolygons(header, data));
    }
}
