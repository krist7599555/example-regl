import glsl from "glslify";
import REGL from "regl";

const regl = REGL();

const media_stream = await navigator.mediaDevices.getUserMedia({ video: true });
const video = document.createElement("video");
video.srcObject = media_stream;

await video.play();
const texture = regl.texture({ data: video });

const drawCameta = regl({
  vert: glsl`
    precision mediump float;
    attribute vec2 position;
    varying vec2 vposition;
    void main() {
      vposition = position;
      gl_Position = vec4(position, 0, 1);
    }`,
  frag: glsl`
    precision mediump float;
    varying vec2 vposition;
    uniform sampler2D texture;
    void main() {
      gl_FragColor = vec4(0, 1, 0, 1);
      gl_FragColor = texture2D(texture, vec2(1.0 - (vposition.x * 0.5 + 0.5), -vposition.y * 0.5 + 0.5));
    }`,
  attributes: {
    position: [
      [-1, -1],
      [1, -1],
      [1, 1],
      [-1, -1],
      [-1, 1],
      [1, 1],
    ],
  },
  uniforms: {
    texture,
  },
  count: 6,
});
regl.frame(() => {
  regl.clear({
    color: [0.8, 1, 0.9, 1],
    depth: 1,
  });
  texture({ data: video });
  drawCameta();
});

export {};
