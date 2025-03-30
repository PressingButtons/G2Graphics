import { mat4, toIdentity } from "../scripts/glmatrix.ts";

export class G2Camera {

    private _view:Float32Array;
    private _projection:Float32Array;
    fov:number;


    constructor(  ) {
        this._view = new Float32Array(16);
        this._projection = new Float32Array(16);
        this.fov = Math.PI / 180; 
        toIdentity(this._view);
        toIdentity(this._projection);
    }

    get projection( ) {
        return this._projection;
    }

    perspective( fov:number, aspect:number, near:number, far:number ) {
        mat4.perspective(this._projection, fov, aspect, near, far);
    }

    ortho( x:number, y:number, scale:number, screenWidth:number, screenHeight:number) {
        mat4.ortho(this._projection, [x, y ,scale], [screenWidth, screenHeight]);       
    }

}