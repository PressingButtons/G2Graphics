import { G2Enum } from "../g2enum.ts";

export const G2_HEADER_BYTES = 16;

export class LineRender implements Drawable {

    private _buffer:ArrayBuffer;
    private _header:Uint16Array;
    private _layers:LineLayer[];

    constructor(numLayers:number) {
        this._buffer = new ArrayBuffer(G2_HEADER_BYTES + LineLayer.BYTE_LENGTH * numLayers);
        this._header = new Uint16Array(this._buffer, 0, G2_HEADER_BYTES / 2);
        this._header.set([G2Enum.SHADER_LINE, G2Enum.VERTEX_LINE, G2Enum.RENDER_LINE]);
        this._layers = new Array(numLayers).fill(0).map((x, i) => new LineLayer(this._buffer, i * LineLayer.BYTE_LENGTH + this._header.byteLength));
    }

    get buffer( ) {
        return this._buffer;  
    }

    layer(i:number) {
        return this._layers[i];
    }

}

class LineLayer {

    static BYTE_LENGTH = 32;

    private _data:Float32Array;
    coord:Float32Array;
    color:Float32Array;

    constructor(buffer:ArrayBuffer, offset:number) {
        this._data = new Float32Array(buffer, offset, 8);
        this.coord = this._data.subarray(0, 4);
        this.color = this._data.subarray(4)
    }

}

class PolygonRender implements Drawable {

    private _buffer:ArrayBuffer;
    protected _header:Uint16Array;
    private _layers:PolygonLayer[]

    constructor(numLayers:number) {
        this._buffer = new ArrayBuffer(G2_HEADER_BYTES + PolygonLayer.BYTE_LENGTH * numLayers);
        this._header = new Uint16Array(this._buffer, 0, G2_HEADER_BYTES / 2);
        this._header.set([G2Enum.SHADER_COLOR, G2Enum.VERTEX_TRIANGLE, G2Enum.RENDER_POLYGON]);
        this._layers = new Array(numLayers).fill(0).map((x, i) => new PolygonLayer(this._buffer, i * PolygonLayer.BYTE_LENGTH + this._header.byteLength));
        this.width = 50;
        this.height = 50;
    }

    get buffer( ) {
        return this._buffer;
    }

    layer(n:number) {
        return this._layers[n];
    }

    get width( ) {
        return this._header[5];
    }

    set width(n:number) {
        this._header[5] = n;
    }

    get height( ) {
        return this._header[6];
    }

    set height(n:number) {
        this._header[6] = n;
    }

    changeRender(render:G2Enum) {
        this._header[2] = render;
    }

    get texture( ) {
        return this._header[3];
    }

    set texture(n:number) {
        this._header[3] = n;
    }

    get palette( ) {
        return this._header[4];
    }

    set palette(n:number) {
        this._header[4] = n;
    }


}

class PolygonLayer {

    static BYTE_LENGTH = 52;

    private _data:Float32Array;
    position:Float32Array;
    rotation:Float32Array;
    scale:Float32Array;
    color:Float32Array;

    constructor(buffer:ArrayBuffer, offset:number) {
        this._data = new Float32Array(buffer, offset);
        this.position = this._data.subarray(0, 2);
        this.rotation = this._data.subarray(2, 5);
        this.scale    = this._data.subarray(5, 7);
        this.color    = this._data.subarray(7, 11); 
        this.color.set([1, 1, 1, 0]);
        this.scale.set([1, 1]);
    }

    get depth( ) {
        return this._data[12];
    }

    set depth(n:number) {
        this._data[12] = n;
    }

    get texturePalette( ) {
        return this._data[13];
    }

    set texturePalette(n:number) {
        this._data[13] = n;
    }

}

export class RectangleRender extends PolygonRender {

    constructor(numLayers:number, options:{shader:G2Enum, render:G2Enum, texture?:number, palette?:number}) {
        super(numLayers);
        this._header.set([
            options.shader, 
            G2Enum.VERTEX_RECTANGLE, 
            options.render, 
            options.texture || 0,
            options.palette || 0
        ]);
    }

}

export class CircleRender extends PolygonRender {

    constructor(numLayers:number, options:{shader:G2Enum, render:G2Enum, texture?:number, palette?:number}) {
        super(numLayers);
        this._header.set([
            options.shader, 
            G2Enum.VERTEX_CIRCLE, 
            options.render, 
            options.texture || 0,
            options.palette || 0
        ]);
    }

    setRadius(n:number) {
        this.width = n;
        this.height = n;
    }

}

