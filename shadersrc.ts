export const lineV =  
`#version 300 es

layout (location=0) in vec4 a_position;
layout (location=5) in vec4 a_color;

uniform mat4 u_projection;

out vec4 v_color;

void main( ) {
    gl_Position = u_projection * a_position;
    v_color = a_color;
}`

export const colorF = 
`#version 300 es

precision mediump float;

in  vec4 v_color;
out vec4 fragColor;

void main( ) {
    fragColor = v_color;
}`

export const colorV = 
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

export const textureF = 
`#version 300 es

precision lowp float;

uniform mediump sampler2DArray u_texture;

in vec4 v_color;
in vec2 v_texcoord;
in float v_depth;

out vec4 fragColor;

void main( ) {
    vec4 texel = texture(u_texture, vec3(v_texcoord, v_depth));
    fragColor = texel * v_color;
}`

export const textureV = 
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
