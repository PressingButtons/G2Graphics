import { Shader } from "../classes/shader.ts";

export function ColorShader( gl:WebGL2RenderingContext ) {
    const vertex = 
        `#version 300 es

        layout (location=0) in vec4 a_position;
        layout (location=1) in mat4 a_transform;
        layout (location=5) in vec4 a_color;

        uniform mat4 u_projection;

        out vec4 v_color;

        void main( ) {
            gl_Position = u_projection * a_transform * a_position;
            v_color = a_color;
        }`
    ;

    const fragment = 
        `#version 300 es

        precision highp float;

        in  vec4 v_color;
        out vec4 fragColor;

        void main( ) {
            fragColor = v_color;
        }`
    ;

    const color = Shader.create(gl, vertex, fragment);
    // create vertices
    const square = color.createVertex('square');
    square.model.setData(
        new Int8Array([
            -1,-1, 0, 
             1,-1, 0,
            -1, 1, 0, 
             1, 1, 0
        ]), 
        gl.STATIC_DRAW
    );
    // setting up square vertex
    square.setAttribute({
        name:"a_position",
        size: 3,
        stride: 3,
        offset: 0,
        type: gl.BYTE,
        buffer:square.model.buffer
    });
    square.setMatrixAttribute({
        name: 'a_transform',
        stride: 88,
        offset:0,
        buffer: color.transform.buffer
    });
    square.setMultiAttribute({
        name:'a_color',
        stride:88,
        offset:64,
        size:4,
        iterations:4,
        type:gl.FLOAT,
        buffer:color.transform.buffer
    });
    // setting up the draw function
    square.draw = function(data) {
        const count = this.shader.transform.update(data);
        gl.bindVertexArray(this.vertex);
        gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, count);
    }

    return color;
}
