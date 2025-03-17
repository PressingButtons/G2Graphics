type DBlock = {
    offset:Binary;
    position:Trio;
    rotation:Trio;
    scale:Trio;
    color:Quad;
    depth:number;
    scheme:number
}

export const DRAWABLE_BLOCKSIZE = 60;
export const DRAWABLE_BASEOFFSET = 4;

export class Drawable {

    origin:[number, number, number];
    texture:number;
    palette:number;
    size:Trio;
    blocks:DBlock[];

    constructor( origin:Trio = [0, 0, 0] ) {
        this.origin = origin;
        this.texture = -1;
        this.palette = -1;
        this.blocks = [];
        this.size = [100, 100, 1];
    }

    createBlock(idx:number = this.blocks.length) {
        const block:DBlock = {
            offset: 0,
            position:[0, 0, 0],
            rotation:[0, 0, 0],
            scale:[1, 1, 1],
            color:[255, 255, 255, 255],
            depth:0,
            scheme:0
        }
        this.blocks.splice(idx, 0, block);
        return block;
    }

    removeBlock(block:DBlock) {
        this.blocks.splice(this.blocks.indexOf(block), 1);
    }

    toBuffer( ) {
        if(this.blocks.length == 0) 
            return new ArrayBuffer(0);
        /**
         * Length Calculation
         * texture + 1 (1)
         * palette + 1 (1)
         * padding + 2 (1)
         * -----------
         * blocks multiplicative
         * position + 3 (4)
         * rotation + 3 (4)
         * scale    + 3 (4)
         * color    + 4 (4)
         * depth    + 1 (4)
         * scheme   + 1 (4)
         * ------------
         * Total 4 + 60(n)
         */
        const buffer = new ArrayBuffer(DRAWABLE_BASEOFFSET + DRAWABLE_BLOCKSIZE * this.blocks.length);
        // -- non repeated data
        new Int8Array(buffer, 0, DRAWABLE_BASEOFFSET).set([this.texture, this.palette]);
        // -- repeated[block] data
        for(let i = 0, block; block = this.blocks[i]; i++ ) {
            // padding out for the sake of floats 
            const offset = DRAWABLE_BASEOFFSET + (i * DRAWABLE_BLOCKSIZE);
            // rotation
            const chunk = new Float32Array(buffer, offset, DRAWABLE_BLOCKSIZE / 4);
            const position = block.position.map((x, i) => x + this.origin[i]);
            const scale = block.scale.map((x, i) => x * this.size[i] * 0.5);
            scale[2] = 1;
            const color = block.color.map(x => x / 255);
            chunk.set([
                ...position,
                ...block.rotation,
                ...scale,
                ...color,
                block.depth,
                block.scheme
            ]);
        }
        return buffer;
    }

}