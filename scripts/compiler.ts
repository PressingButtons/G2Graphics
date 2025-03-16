export function Compiler( gl:WebGL2RenderingContext, vertex:string, fragment:string ) {
    const vshader = compileProgam(gl, vertex, gl.VERTEX_SHADER);
    const fshader = compileProgam(gl, fragment, gl.FRAGMENT_SHADER);
    return compileProgam(gl, vshader, fshader);
}

const compileShader = (gl:WebGL2RenderingContext, source:string, type:GLenum) => {
    const shader = gl.createShader( type ) as WebGLShader;
    try {
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if(!success) throw 'GL - Shader Compile Error.'
        return shader;
    } catch( error ) {
        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        throw error;
    }
}

const compileProgam = (gl:WebGL2RenderingContext, vertex:WebGLShader, fragment:WebGLShader) => {
    const program = gl.createProgram( );
    try {
        gl.attachShader(program, vertex);
        gl.attachShader(program, fragment);
        gl.linkProgram(program);
        const success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if(!success) throw 'GL - Program Compile Error.';
        return program;
    } catch(err) {
        console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        throw err;
    }
}
