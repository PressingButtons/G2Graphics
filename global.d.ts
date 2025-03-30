type ThreadMessage = {
    route:string;
    content:any;
}

type Duo = [number, number];
type Trio = [number, number, number];
type Quad = [number, number, number, number];
type Binary = (0 | 1);

type ShaderProgram = (header:Uint16Array, data:Float32Array, projection:Float32Array) => void; 

type Drawable = {
    buffer:ArrayBuffer;
}

type SingleAttribute = {
    name:string;
    type:GLenum;
    size:(1 | 2 | 3 | 4);
    stride:number;
    offset:number;
    buffer:WebGLBuffer;
}

interface MultiAttribute extends SingleAttribute {
    iterations:number;
}

type MatrixAttribute = Omit<SingleAttribute, "size" | "type">;