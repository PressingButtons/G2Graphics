export namespace TextureLib {

    type TextureRequest = {
        id:number;
        type:number;
        size:Duo;
        bitmap:ImageBitmap;
    }

    type TextureEntry = {
        texture:WebGLTexture,
        type:GLenum;
    }

    let gl:WebGL2RenderingContext;

    let textures:{[key:number]:TextureEntry}

    export function enable(context:WebGL2RenderingContext) {
        gl = context;
        textures = { };
    }

    export function create(options:TextureRequest) {
        const {id, bitmap, size, type} = options;
        const texture = gl.createTexture( );
        switch(type) {
            default:
                const depth = Math.floor(bitmap.height / size[1]);
                gl.bindTexture(gl.TEXTURE_2D_ARRAY, texture);
                gl.texImage3D(gl.TEXTURE_2D_ARRAY, 0, gl.RGBA, ...size, depth, 0, gl.RGBA, gl.UNSIGNED_BYTE, bitmap );
                gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                gl.texParameterf(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                gl.bindTexture(gl.TEXTURE_2D_ARRAY, null); //clean
                textures[id] = {texture, type: gl.TEXTURE_2D_ARRAY}
            break;
            case 1:
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bitmap)
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                gl.generateMipmap(gl.TEXTURE_2D);
                gl.bindTexture(gl.TEXTURE_2D, null);
                textures[id] = {texture, type: gl.TEXTURE_2D}
             break;
        }
    }

    export function clear(...ids:number[]) {
        ids.map( x => delete textures[x] );
    }

    export function use(id:number, uniform:WebGLUniformLocation, index:number = 0) {
        const entry = textures[id];
        if(entry) {
            gl.bindTexture(entry.type, entry.texture);
            gl.activeTexture(gl.TEXTURE0 + index);
            gl.uniform1i(uniform, index);
        }
    }

}