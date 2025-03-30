import { G2Camera } from "../classes/camera.ts";
import { G2_HEADER_BYTES } from "../classes/drawable.ts";
import { G2Enum } from "../g2enum.ts";
import { ColorShader } from "../shaders/color.ts";
import { LineShader } from "../shaders/line.ts";
import { TextureShader } from "../shaders/texture.ts";

export namespace Renderer {
    // global variables 
    let gl:WebGL2RenderingContext;
    let buffers:ArrayBuffer[] = [];
    // global objects 
    const camera = new G2Camera( );
    const shaders:{[key:number]: ShaderProgram} = { }
    // internal functions
    function initShaders( ) {
        shaders[G2Enum.SHADER_LINE] = LineShader(gl);
        shaders[G2Enum.SHADER_COLOR] = ColorShader(gl);
        shaders[G2Enum.SHADER_TEXTURE] = TextureShader(gl);
    }

    function renderBuffer( buffer:ArrayBuffer ) {
        const header = new Uint16Array(buffer, 0, G2_HEADER_BYTES / 2);
        const data   = new Float32Array(buffer, G2_HEADER_BYTES);
        // =========================================
        const shaderType = header[0];
        if(shaders[shaderType]) 
            shaders[shaderType](header, data, camera.projection);
    }
    // external functions
    export function enable( context:WebGL2RenderingContext ) {
        gl = context;
        camera.ortho(0, 0, 1, gl.canvas.width, gl.canvas.height);
        initShaders( );
    }

    export function allocate(inbuffers:ArrayBuffer[]) {
        buffers.push(...inbuffers);
    }

    export function render( ) {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        while(buffers.length > 0)
            renderBuffer(buffers.shift() as ArrayBuffer);
    }
}