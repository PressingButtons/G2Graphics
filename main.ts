import { ThreadObject } from "../Threader/thread.ts";

const url = new URL('/scripts/thread.js', import.meta.url);

let instance:G2Graphics;

export class G2Graphics {

    static async enable(canvas:HTMLCanvasElement) {
        if(instance) return instance;
        console.log('Enabling Graphics...');
        const thread = new ThreadObject(new URL('./scripts/thread.js', import.meta.url));
        // initialize thread 
        const offsreen = canvas.transferControlToOffscreen( );
        await thread.request('init', offsreen, [offsreen]);
        console.log('Graphics Enabled!');
        instance = new G2Graphics(thread);
        return instance;
    }

    private _thread:ThreadObject;

    private constructor( thread:ThreadObject) {
        this._thread = thread;
    }

    async createTexture(id:number, url:URL | string, size:[number, number], type:number = 0) {
        const bitmap = await this.loadBitmap(url);
        return this._thread.send("make-texture", {id, bitmap, size, type}, [bitmap]);
    }

    async loadBitmap(url:URL | string):Promise<ImageBitmap> {
        return new Promise((resolve, reject) => {
            const image = new Image( );
            image.onload = (event) => resolve(createImageBitmap(image));
            image.onerror = (event) => reject(event);
            if(typeof url == 'string') image.src = url;
            else image.src = url.href;
        });
    }

    async resize(size:Duo) {
        return this._thread.send('resize', size);
    }

    async clear(color:Quad) {
        this._thread.send('clear', color);
    }

    async sendChunks(buffers:ArrayBuffer[]) {
        this._thread.send('allocate', buffers, buffers);
    }

    async render( ) {
        this._thread.send('render');
    }

    async setCamera(camera:Quad = [0, 0, 1, 45], look?:Trio) {
        this._thread.send('camera', {camera, look});
    }

    async draw(buffers:ArrayBuffer[], background:Quad = [0, 0, 0.2, 1], camera:Trio = [0, 0, 1]) {
        this._thread.send('draw', {buffers, camera, background}, buffers);
    }

}

