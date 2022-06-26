import{R as e,b as a}from"./regl.efea0522.js";import{r}from"./resl-fs.8073eef2.js";var s="/example-regl/assets/monalisa.0b4f307c.jpg";const o=e(),t=await r({monalisa:{type:"image",src:s,parser(i){return o.texture({mag:"linear",data:i})}}}),n=o({frag:a`
    precision mediump float;
    varying vec2 vposition;
    uniform sampler2D image1;

    #define CIRCLE_COLOR    vec4(1.0, 0.4313, 0.3411, 1.0)
    #define OUTSIDE_COLOR   vec4(0.3804, 0.7647, 1.0, 1.0)

    void main () {
      gl_FragColor = texture2D(image1, vec2(vposition.x + 1.0, -vposition.y + 1.0) * 0.5);
      if (abs(vposition.x - vposition.y) < 0.2) {
        gl_FragColor = vec4(0.0, gl_FragColor.gb, 1);
      }
    }`,vert:a`
    precision mediump float;
    attribute vec2 position;
    varying vec2 vposition;

    void main () {
      vposition = position;
      gl_Position = vec4(position, 0, 1);
    }`,attributes:{position:({tick:i})=>[[-1,Math.sin(i*.03)],[0,-1],[1,Math.sin(i*.05)]]},uniforms:{image1:t.monalisa},count:3});o.frame(()=>{o.clear({color:[.8,.7,.9,1],depth:1}),n()});
