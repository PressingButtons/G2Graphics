import { WorkerThread } from "../Threader/thread.ts";
import { ShaderLib } from "./shaderlib.ts";
import { TextureLib } from "./texturelib.ts";
// ===============
const thread = new WorkerThread( self );
// ===============
thread.listen('init', async(canvas:OffscreenCanvas) => {
    const gl = canvas.getContext('webgl2') as WebGL2RenderingContext;
    const ratio = (gl.canvas.width / gl.canvas.height);
    // enable parameters 
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    // enable libraries
    ShaderLib.enable(gl);
    TextureLib.enable(gl);
    // some functions 
    const resize = (size:Duo) => {
        canvas.width = size[0];
        canvas.height = size[1];
        ShaderLib.redraw( );
    }
    // setup routes
    thread.listen('draw', ShaderLib.draw);
    thread.listen('make-texture', TextureLib.create);
    thread.listen('release-texture', TextureLib.clear);
    thread.listen('resize', resize);
});