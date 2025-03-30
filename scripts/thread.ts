import { WorkerThread } from "../../Threader/thread.ts";
import { Renderer } from "./renderer.ts";
import { TextureLib } from "./texturelib.ts";
// ===============
const thread = new WorkerThread( self );
// ===============
thread.listen('init', async(canvas:OffscreenCanvas) => {
    const gl = canvas.getContext('webgl2') as WebGL2RenderingContext;
    // enable parameters 
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    // enable libraries
    Renderer.enable(gl);
    TextureLib.enable(gl);
    // some functions 
    const resize = (size:Duo) => {
        canvas.width = size[0];
        canvas.height = size[1];
        Renderer.render( );
    }
    const clear = (color:Quad) => {
        gl.clearColor(...color);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
    // setup routes
    thread.listen('allocate', Renderer.allocate)
    thread.listen('render', Renderer.render);
    thread.listen('make-texture', TextureLib.create);
    thread.listen('release-texture', TextureLib.clear);
    thread.listen('resize', resize);
    // non lib routes
    thread.listen('draw', (params:{buffers:ArrayBuffer[], camera:Trio, background:Quad}) => {
        clear(params.background);
        Renderer.allocate(params.buffers);
        Renderer.render( ); 
    });
    thread.listen('clear', clear);
});