# G2Graphics Library 

A Webgl2 rendering library that uses webworkers.  
Originally created for personal game development, this library can be used for other web-based applications with customization.

### How to Use 

File "G2Graphics/main" holds the G2Graphics namespace used to initalize and make calls to the worker thread. Call the Promise __G2Graphics.enable(canvas)__ to send an HTMLCanvasElement that will be used for rendering and await its initialization. The thread will open up listening routes for specific rendering requests. Such requests include:

1. clear - Fills the canvas with a specified color [R,G,B,A]
1. sendChunks - Send an array buffer that will be held until the next render call
1. render - Draws all allocated chunks sent by "sendChunks"
1. setCamera - Updates the projection matrix
1. draw - A composite of "sendChunks", "setCamera", "clear" and "render" into one request

To manage how the requests are sent, use **Drawables** to send allocation and render requests

### Drawables 

**Drawables** are classes to draw particular shapes within the system. 
Currently **Drawables** can draw Lines, Solid Colors and Textures.
Each **Drawable** object has a buffer that can be used in draw calls.
*** IMPORTANT NOTE *** for now the user should create a __structuredClone__ of the buffers meant to be sent, otherwise the current Drawable will lose access to its own data.  
When creating a **Drawable** the user must specify how many layers the **Drawable** and depending on the type of Drawable, what type of shape and render the Drawable should use. 
