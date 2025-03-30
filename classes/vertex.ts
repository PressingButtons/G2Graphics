export class Vertex {

    #program:WebGLProgram;
    #vertex:WebGLVertexArrayObject

    constructor( gl:WebGL2RenderingContext, program:WebGLProgram ) {
        this.#program = program;
        this.#vertex = gl.createVertexArray( );
    }
    
    setAttribute( gl:WebGL2RenderingContext, config:SingleAttribute ) {
        const location = gl.getAttribLocation(this.#program, config.name);
        if(location == -1) throw `Error - Attribute "${config.name}" not found`;
        const byteLength = GetByteLength(gl, config.type);
        gl.bindVertexArray(this.#vertex);
        gl.bindBuffer(gl.ARRAY_BUFFER, config.buffer);
        gl.enableVertexAttribArray(location);
        gl.vertexAttribPointer(
            location,
            config.size,
            config.type,
            false,
            config.stride * byteLength,
            config.offset * byteLength
        );
    }

    setMatrixAttribute(gl:WebGL2RenderingContext, config:MatrixAttribute) {
        const location = gl.getAttribLocation(this.#program, config.name);
        if(location == -1) throw `Error - Attribute "${config.name}" not found`;
        const byteLength = 4
        gl.bindVertexArray(this.#vertex);
        gl.bindBuffer(gl.ARRAY_BUFFER, config.buffer);
        for(let i = 0; i < 4; i++) {
            gl.enableVertexAttribArray(location + i);
            gl.vertexAttribDivisor(location + i, 1);
            gl.vertexAttribPointer(
                location + i,
                4,
                gl.FLOAT,
                false,
                config.stride * byteLength,
                config.offset * byteLength + (i * 16)
            )
        }
    }

    setMultiAttribute(gl:WebGL2RenderingContext, config:MultiAttribute) {
        const location = gl.getAttribLocation(this.#program, config.name);
        if(location == -1) throw `Error - Attribute "${config.name}" not found`;
        const byteLength = GetByteLength(gl, config.type);
        gl.bindVertexArray(this.#vertex);
        gl.bindBuffer(gl.ARRAY_BUFFER, config.buffer);
            for(let i = 0; i < config.iterations; i++) {
            gl.enableVertexAttribArray(location + i);
            gl.vertexAttribDivisor(location + i, 1);
            gl.vertexAttribPointer(
                location + i,
                config.size,
                config.type,
                false,
                config.stride * byteLength,
                config.offset * byteLength
            );
        }
    }

    activate(gl:WebGL2RenderingContext) {
        gl.bindVertexArray(this.#vertex);
    }

}

const GetByteLength = (gl:WebGL2RenderingContext, e:GLenum) => {
    switch(e) {
        case gl.BYTE: return 1;
        case gl.SHORT: return 2;
    }
    return 4;
}