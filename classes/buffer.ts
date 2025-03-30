let gl:WebGL2RenderingContext;

export class BufferObject {

    protected _data:Int8Array | Int16Array | Float32Array;
    private _buffer:WebGLBuffer;

    constructor( context:WebGL2RenderingContext, data:(Int8Array | Int16Array | Float32Array), usage:GLenum) {
        if(!gl) gl = context;
        this._buffer = gl.createBuffer( );
        this._data = this.set(data, usage);
    }

    get buffer( ) {
        return this._buffer;
    }

    slice(start:number, length:number) {
        return this._data.subarray(start, start + length);
    }

    set(data:Int8Array | Int16Array | Float32Array , usage:GLenum) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, usage);
        return data;
    }

    subdata(data:(Int8Array | Int16Array | Float32Array), offset:number) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, offset, data);
    }

    refresh( ) {
        this.subdata(this._data, 0);
    }

}