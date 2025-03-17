import { Shader } from "../classes/shader.ts";
import { ColorShader } from "../shaders/color.ts";
import { mat4 } from "./glmatrix.ts";

export namespace ShaderLib {

    let gl:WebGL2RenderingContext;

    let color:Shader;
    let texture:Shader;
    let cached:{camera:Trio, buffers:ArrayBuffer[]}

    export function enable(context:WebGL2RenderingContext) {
        gl = context;
        color = ColorShader(gl);
    }

    export function draw(options:{camera:Trio, buffers:ArrayBuffer[]}) {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        fill([0, 0, 0.2, 0.1]);
        cached = options;
        const projection = new Float32Array(16);
        mat4.ortho(projection, options.camera, gl.canvas as OffscreenCanvas);
        for(const buffer of options.buffers) {
            if(buffer.byteLength == 0) continue;
            const base = new Int8Array(buffer, 0, 4);
            if(base[0] == -1) color.draw('square', projection, buffer);
        }
    }

    export function fill(color:Quad) {
        gl.clearColor(...color);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    export function redraw( ) {
        if(cached)
            draw(cached);
    }

}