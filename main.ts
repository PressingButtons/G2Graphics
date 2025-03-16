import { ThreadObject } from "./Threader/thread.ts";

const url = new URL('thread.js', import.meta.url);

let instance:G2Graphics;

export class G2Graphics {

    static async enable(canvas:HTMLCanvasElement) {
        if(instance) return instance;
        const worker = new Worker(new URL('/scripts/thread.ts', import.meta.url));
        const thread = new ThreadObject(worker);
        // initialize thread 
        const offsreen = canvas.transferControlToOffscreen( );
        await thread.send('init', offsreen, [offsreen]);
        instance = new G2Graphics(thread);
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

    async draw( drawables:Drawable[] ) {
        const buffers = drawables.map( x => x.toBuffer( ));
        return this._thread.send('draw', buffers, buffers);     
    }

}

type DBlock = {
    offset:Binary;
    position:Trio;
    rotation:Trio;
    scale:Trio;
    color:Quad;
    depth:number;
    scheme:number
}

export class Drawable {

    origin:[number, number, number];
    texture:number;
    palette:number;
    blocks:DBlock[];

    constructor( origin:Trio = [0, 0, 0] ) {
        this.origin = origin;
        this.texture = -1;
        this.palette = -1;
        this.blocks = [];
    }

    createBlock(idx:number = this.blocks.length) {
        const block:DBlock = {
            offset: 0,
            position:[0, 0, 0],
            rotation:[0, 0, 0],
            scale:[100, 100, 100],
            color:[255, 255, 255, 255],
            depth:0,
            scheme:0
        }
        this.blocks.splice(idx, 0, block);
    }

    toBuffer( ) {
        /**
         * Length Calculation
         * texture + 1 (1)
         * palette + 1 (1)
         * -----------
         * blocks multiplicative
         * position + 3 (2)
         * rotation + 3 (4)
         * scale    + 3 (2)
         * color    + 4 (1)
         * depth    + 1 (1)
         * scheme   + 1 (1)
         * ------------
         * Total 2 + (30 + pad by 2)(n)
         */
        const base = 2;
        const blocksize = 30;
        const padding = 2;
        const buffer = new ArrayBuffer(base + blocksize * this.blocks.length);
        // -- non repeated data
        new Uint8Array(buffer, 0, base).set([this.texture, this.palette]);
        // -- repeated[block] data
        for(let i = 0, block; block = this.blocks[i]; i++ ) {
            // padding out for the sake of floats 
            const offset = base + padding + (i * blocksize);
            // rotation
            new Float32Array(buffer, offset, 12).set(block.rotation);
            new Uint8Array(buffer, offset + 12, 6).set([block.depth, block.scheme, ...block.color]);
            new Int16Array(buffer, offset + 18, 12).set([...block.position, ...block.scale]);
        }
        return buffer;
    }

}