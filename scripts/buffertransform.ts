import { BufferObject } from "../classes/buffer.ts";
import { mat4 } from "./glmatrix.ts";

const ELEMENTS_PER_INSTANCE = 13;
const BYTES_PER_INSTANCE = ELEMENTS_PER_INSTANCE * Float32Array.BYTES_PER_ELEMENT;
const LINE_TRANSFORM_LENGTH = 20;
const TRANSFORM_LENGTH = 22;
const FILL_ELEMENTS_PER_INSTANCE = 15;
const FILL_BYTES_PER_INSTANCE = FILL_ELEMENTS_PER_INSTANCE * Float32Array.BYTES_PER_ELEMENT;
const FILL_TRANSFORM_LENGTH = 22;

// for point to point lines
export function transformLineBuffer(buffer:BufferObject, header:Uint16Array, data:Float32Array ) {
    const count = data.byteLength / BYTES_PER_INSTANCE;
    for(let i = 0; i < count; i++) {
        const dataOffset = i * ELEMENTS_PER_INSTANCE;
        let view = data.subarray(dataOffset, dataOffset + ELEMENTS_PER_INSTANCE);
        // ==========================
        const bufferOffset = i * LINE_TRANSFORM_LENGTH;
        const bufferData = buffer.slice(bufferOffset, TRANSFORM_LENGTH) as Float32Array;
        // ==========================
        mat4.fromTranslation(bufferData, [view[0], view[1], 0]);
        mat4.rotate(bufferData, [view[2], view[3], view[4]]);
        mat4.scale(bufferData, [view[5] * header[5], view[6] * header[6], 1]);
        bufferData.set([view[7], view[8], view[9], view[10]], 16);
    }
    buffer.refresh( );
    return count;
}

// for close polygonal shapes
export function transformPolygonBuffer( buffer:BufferObject, header:Uint16Array, data:Float32Array ) {
    const count = data.byteLength / BYTES_PER_INSTANCE;
    for(let i = 0; i < count; i++) {
        const dataOffset = i * ELEMENTS_PER_INSTANCE;
        let view = data.subarray(dataOffset, dataOffset + ELEMENTS_PER_INSTANCE);
        // ==========================
        const bufferOffset = i * LINE_TRANSFORM_LENGTH;
        const bufferData = buffer.slice(bufferOffset, TRANSFORM_LENGTH) as Float32Array;
        // ==========================
        mat4.fromTranslation(bufferData, [view[0], view[1], 0]);
        mat4.rotate(bufferData, [view[2], view[3], view[4]]);
        mat4.scale(bufferData, [view[5] * header[5], view[6] * header[6], 1]);
        // color 
        bufferData.set([view[7], view[8], view[9], view[10]], 16);
        // misc
        bufferData.set([view[11], view[12]], 20);

        console.table(bufferData);
    }
    buffer.refresh( );
    return count;
}