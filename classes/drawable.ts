export const DrawableBlockSize = 60;
export const DrawableBaseSize = 4;

export class Drawable {

    origin:Trio;
    size:Trio;
    texture:number;
    palette:number;

    blocks:DrawableBlock[];

    constructor( blocks:number, origin:Trio = [0, 0, 0] ) {
        this.origin = origin;
        this.size = [100, 100, 1];
        this.texture = 0;
        this.palette = 0;
        this.blocks = new Array(blocks).fill(0).map(( ) => new DrawableBlock( ));
    }

    toBuffer( ) {
        const buffer = new ArrayBuffer(DrawableBaseSize + DrawableBlockSize * this.blocks.length);
        // set base values
        new Uint8Array(buffer, 0, DrawableBaseSize).set([this.texture, this.palette]);
        for(let i = 0, block; block = this.blocks[i]; i++) {
            let {position, rotation, scale, color, depth, scheme, offset} = block;
            if(offset == 0) 
                position = position.map((x, i) => x + this.origin[i]) as Trio;
            scale = scale.map((x, i) => x * this.size[i] * 0.5) as Trio;
            color = color.map(x => x/255) as Quad;
            let start = DrawableBaseSize + DrawableBlockSize * i;
            new Float32Array(buffer, start , DrawableBlockSize / 4).set([
                ...position,
                ...rotation,
                ...scale,
                ...color,
                depth,
                scheme
            ]);
        }
        return buffer;
    }

}


class DrawableBlock {

    position:Trio;
    rotation:Trio;
    scale:Trio;
    color:Quad;
    depth:number;
    scheme:number;
    offset:Binary;

    constructor( ) {
        this.position = [0, 0, 0];
        this.rotation = [0, 0, 0];
        this.scale = [1, 1, 1];
        this.color = [255, 255, 255, 0];
        this.depth = 0;
        this.scheme = 0;
        this.offset = 0;
    }

    hide( ) {
        this.color[3] = 0;
    }

}