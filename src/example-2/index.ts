import glsl from "glslify";
import REGL from "regl";
import { reslPromise } from "../resl-fs";
import monalisa_url from "./monalisa.jpg?url";

const regl = REGL();

const loader = await reslPromise({
  monalisa: {
    type: "image",
    src: monalisa_url,
    parser(data: HTMLImageElement) {
      return regl.texture({
        mag: "linear",
        data: data,
      });
    },
  },
});

const drawMonalisa = regl({
  frag: glsl`
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
    }`,

  vert: glsl`
    precision mediump float;
    attribute vec2 position;
    varying vec2 vposition;

    void main () {
      vposition = position;
      gl_Position = vec4(position, 0, 1);
    }`,
  attributes: {
    position: ({ tick }) => [
      [-1, Math.sin(tick * 0.03)],
      [0, -1],
      [1, Math.sin(tick * 0.05)],
    ],
  },
  uniforms: {
    image1: loader.monalisa,
  },
  count: 3,
});

regl.frame(() => {
  regl.clear({
    color: [0.8, 0.7, 0.9, 1],
    depth: 1,
  });
  drawMonalisa();
  return;
});

export {};
