import { Drawable } from "./classes/drawable.ts";
import { ThreadObject } from "./Threader/thread.ts";

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


    async fill(color:[number, number, number, number]) {
        return this._thread.send('fill', color);
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

    async draw( drawables:Drawable[], camera:Trio = [0, 0, 1] ) {
        const buffers = drawables.map( x => x.toBuffer( ));
        return this._thread.send('draw', {camera, buffers}, buffers);     
    }

}

