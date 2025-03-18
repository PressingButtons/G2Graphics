import { Shader } from "../classes/shader.ts";
import { TextureLib } from "../scripts/texturelib.ts";

const vertex = 
`#version 300 es

layout (location=0) in vec4 a_position;
layout (location=1) in vec2 a_texcoord;
layout (location=2) in mat4 a_transform;
layout (location=6) in vec4 a_color;
layout (location=10) in float a_depth;

uniform mat4 u_projection;

out vec4 v_color;
out float v_depth;
out vec2 v_texcoord;

void main( ) {
    gl_Position = u_projection * a_transform * a_position;
    v_color = a_color;
    v_depth = a_depth;
    v_texcoord = a_texcoord;
}`
;

const fragment = 
`#version 300 es

precision highp float;

uniform mediump sampler2DArray u_texture;

in vec4 v_color;
in vec2 v_texcoord;
in float v_depth;

out vec4 fragColor;

void main( ) {
    vec4 texel = texture(u_texture, vec3(v_texcoord, v_depth));
    fragColor = texel * v_color;
}`


export function TextureShader( gl:WebGL2RenderingContext ) {
    // create objects 
    const shader = Shader.create(gl, vertex, fragment);
    // setting vertices 
    // square 
    const square = shader.createVertex('square');
    const utexture = gl.getUniformLocation(shader.program, 'uTexture') as WebGLUniformLocation;

    square.model.setData(
        new Int8Array([
            -1,-1, 0, 0, 0,
             1,-1, 0, 1, 0,
            -1, 1, 0, 0, 1,
             1, 1, 0, 1, 1
        ]), 
        gl.STATIC_DRAW
    );
    // set square attributes
    square.setAttribute({
        name:"a_position",
        size: 3,
        stride: 5,
        offset: 0,
        type: gl.BYTE,
        buffer:square.model.buffer
    });

    square.setAttribute({
        name:"a_texcoord",
        size: 2,
        stride: 5,
        offset: 3,
        type: gl.BYTE,
        buffer:square.model.buffer
    });

    square.setMatrixAttribute({
        name: 'a_transform',
        stride: 88,
        offset: 0,
        buffer: shader.transform.buffer
    });

    square.setMultiAttribute({
        name:'a_color',
        stride:88,
        offset:64,
        size:4,
        iterations:4,
        type:gl.FLOAT,
        buffer:shader.transform.buffer
    });

    square.setAttribute({
        name:"a_depth",
        size: 1,
        stride: 88,
        offset: 80,
        type: gl.FLOAT,
        buffer:shader.transform.buffer
    });

    square.draw = function(data) {
        const count = shader.transform.update(data);
        gl.bindVertexArray(this.vertex);
        TextureLib.use(new Int8Array(data)[0], utexture, 0);
        gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, count);
    }

    return shader;

}