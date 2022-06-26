import{R as a,b as o}from"./regl.efea0522.js";const t=a(),r=await navigator.mediaDevices.getUserMedia({video:!0}),e=document.createElement("video");e.srcObject=r;await e.play();const i=t.texture({data:e}),n=t({vert:o`
    precision mediump float;
    attribute vec2 position;
    varying vec2 vposition;
    void main() {
      vposition = position;
      gl_Position = vec4(position, 0, 1);
    }`,frag:o`
    precision mediump float;
    varying vec2 vposition;
    uniform sampler2D texture;
    void main() {
      gl_FragColor = vec4(0, 1, 0, 1);
      gl_FragColor = texture2D(texture, vec2(1.0 - (vposition.x * 0.5 + 0.5), -vposition.y * 0.5 + 0.5));
    }`,attributes:{position:[[-1,-1],[1,-1],[1,1],[-1,-1],[-1,1],[1,1]]},uniforms:{texture:i},count:6});t.frame(()=>{t.clear({color:[.8,1,.9,1],depth:1}),i({data:e}),n()});
