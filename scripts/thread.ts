import { WorkerThread } from "../Threader/thread.ts";
import { TextureLib } from "./texturelib";

const thread = new WorkerThread( self );

thread.listen('init', async(canvas:OffscreenCanvas) => {
    const gl = canvas.getContext('webgl') as WebGL2RenderingContext;
    // enable parameters 
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    // enable libraries
    TextureLib.enable(gl);
    // setup routes
    thread.listen('make-texture', TextureLib.create);
    thread.listen('release-texture', TextureLib.clear);
});

