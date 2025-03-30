import { LineVertex } from "../classes/linevertex.ts";
import { Compiler } from "../scripts/compiler.ts";
import { colorF, lineV } from "../shadersrc.ts";

export function LineShader(gl:WebGL2RenderingContext):ShaderProgram {

    const program = Compiler(gl, lineV, colorF );
    const uprojection = gl.getUniformLocation(program, 'u_projection');

    const line = new LineVertex(gl, program);

    return function(header:Uint16Array, data:Float32Array, projection:Float32Array) {
        gl.useProgram(program);
        gl.uniformMatrix4fv(uprojection, false, projection);
        line.activate(gl);
        gl.drawArraysInstanced(gl.LINES, 0, 2, line.setLines(data));
    }

}