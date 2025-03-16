/*!
@fileoverview gl-matrix - High performance matrix and vector operations
@author Brandon Jones
@author Colin MacKenzie IV
@version 3.4.3

Copyright (c) 2015-2021, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

MODIFIED FROM
*/

export namespace mat4 {

    export function ortho(out:Float32Array, camera:Trio | Float32Array, canvas:OffscreenCanvas) {
        const hw = canvas.width  * 0.5 * camera[2]
        const hh = canvas.height * 0.5 * camera[2];
        const top = camera[1] - hh;
        const left = camera[0] - hw;
        const right = camera[0] + hw;
        const bottom = camera[1] + hh;
        const near = 1;
        const far = -1;
        let lr = 1 / (left - right);
        let bt = 1 / (bottom - top);
        let nf = 1 / (near - far);
        // matrix manipulation 
        out[0] = -2 * lr;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = -2 * bt;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[10] = 2 * nf;
        out[11] = 0;
        out[12] = (left + right) * lr;
        out[13] = (top + bottom) * bt;
        out[14] = (far + near) * nf;
        out[15] = 1;
    }

    export function fromTranslation(out:Float32Array, v:Trio | Float32Array) {
        out[0] = 1;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = 1;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[10] = 1;
        out[11] = 0;
        out[12] = v[0];
        out[13] = v[1];
        out[14] = v[2];
        out[15] = 1;
    }

    export function rotate(out:Float32Array, r:Trio | Float32Array) {
        rotateX(out, r[0]);
        rotateY(out, r[1]);
        rotateZ(out, r[2]);
    }

    export function rotateX(out:Float32Array, rad:number) {
        let s = Math.sin(rad);
        let c = Math.cos(rad);
        // =================
        let a10 = out[4];
        let a11 = out[5];
        let a12 = out[6];
        let a13 = out[7];
        let a20 = out[8];
        let a21 = out[9];
        let a22 = out[10];
        let a23 = out[11];
        // Perform axis-specific matrix multiplication
        out[4] = a10 * c + a20 * s;
        out[5] = a11 * c + a21 * s;
        out[6] = a12 * c + a22 * s;
        out[7] = a13 * c + a23 * s;
        out[8] = a20 * c - a10 * s;
        out[9] = a21 * c - a11 * s;
        out[10] = a22 * c - a12 * s;
        out[11] = a23 * c - a13 * s;
    }

    export function rotateY(out:Float32Array, rad:number) {
        let s = Math.sin(rad);
        let c = Math.cos(rad);
        let a00 = out[0];
        let a01 = out[1];
        let a02 = out[2];
        let a03 = out[3];
        let a20 = out[8];
        let a21 = out[9];
        let a22 = out[10];
        let a23 = out[11];
        // Perform axis-specific matrix multiplication
        out[0] = a00 * c - a20 * s;
        out[1] = a01 * c - a21 * s;
        out[2] = a02 * c - a22 * s;
        out[3] = a03 * c - a23 * s;
        out[8] = a00 * s + a20 * c;
        out[9] = a01 * s + a21 * c;
        out[10] = a02 * s + a22 * c;
        out[11] = a03 * s + a23 * c;
        return out;
    }

    export function rotateZ(out:Float32Array, rad:number) {
        let s = Math.sin(rad);
        let c = Math.cos(rad);
        let a00 = out[0];
        let a01 = out[1];
        let a02 = out[2];
        let a03 = out[3];
        let a10 = out[4];
        let a11 = out[5];
        let a12 = out[6];
        let a13 = out[7]; 
        // Perform axis-specific matrix multiplication
        out[0] = a00 * c + a10 * s;
        out[1] = a01 * c + a11 * s;
        out[2] = a02 * c + a12 * s;
        out[3] = a03 * c + a13 * s;
        out[4] = a10 * c - a00 * s;
        out[5] = a11 * c - a01 * s;
        out[6] = a12 * c - a02 * s;
        out[7] = a13 * c - a03 * s;
        return out;
    }

    export function scale(out:Float32Array, v:Trio | Float32Array) {
        out[0]  *= v[0];
        out[1]  *= v[0];
        out[2]  *= v[0];
        out[3]  *= v[0];
        out[4]  *= v[1];
        out[5]  *= v[1];
        out[6]  *= v[1];
        out[7]  *= v[1];
        out[8]  *= v[2];
        out[9]  *= v[2];
        out[10] *= v[2];
        out[11] *= v[2];
    }
}