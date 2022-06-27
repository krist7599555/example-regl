/// <reference types="./index" />
import glsl from "glslify";
import REGL from "regl";
import cv, { Mat } from "opencv-ts";
import $ from "cash-dom";

await new Promise<void>((resolve) => {
  cv.onRuntimeInitialized = () => resolve();
});

const regl = REGL();

const media_stream = await navigator.mediaDevices.getUserMedia({ video: true });
const video = document.createElement("video");
video.srcObject = media_stream;

$("body").append(video);

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
    // position: from: [-1, 1] to: [0, 1]
    vec2 position_to_uv_coor(vec2 position) {
      return position * vec2(0.5, -0.5) + 0.5;
    }
    void main() {
      gl_FragColor = vec4(0, 1, 0, 1);
      gl_FragColor = texture2D(texture, position_to_uv_coor(vposition));
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

window["cv"] = cv;

const tick = () => new Promise((res) => requestAnimationFrame(res));

await tick();
await tick();
await tick();

video.height = video.videoHeight;
video.width = video.videoWidth;

let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
let dst = new cv.Mat(video.height, video.width, cv.CV_8UC1);
let gray = new cv.Mat();
let cap = new cv.VideoCapture(video);
let faces = new cv.RectVector();
let classifier = new cv.CascadeClassifier();

import haarcascade_frontalface_default_url from "./haarcascade_frontalface_default.xml?url";
const haarcascade_frontalface_ref = <const>`/haarcascade.xml`; // can not be nested url

const haarcascade_frontalface_default_array_buffer = await fetch(
  haarcascade_frontalface_default_url
)
  .then((res) => res.arrayBuffer())
  .then((res) => new Uint8Array(res));

cv.FS_createDataFile(
  "/",
  haarcascade_frontalface_ref,
  haarcascade_frontalface_default_array_buffer,
  true,
  false,
  false
);

classifier.load(haarcascade_frontalface_ref);

const process_video_canvas_output = document.createElement("canvas");
process_video_canvas_output.width = video.width;
process_video_canvas_output.height = video.height;
function detech_face() {
  cap.read(src);
  src.copyTo(dst);
  cv.cvtColor(dst, gray, cv.COLOR_RGBA2GRAY, 0);
  try {
    console.time("x");
    classifier.detectMultiScale(gray, faces, 1.1, 3, 0); // hot 200ms per call
    console.log(faces.size());
    console.timeEnd("x");
  } catch (err) {
    console.log(err);
  }

  // return Array.from({ length: faces.size() }).map((_, i) => {
  //   const rect = faces.get(i);
  //   return {
  //     x: rect.x,
  //     y: rect.y,
  //     width: rect.width,
  //     height: rect.height,
  //   };
  // });

  // if write to canvas
  for (let i = 0; i < faces.size(); ++i) {
    let face = faces.get(i);
    let point1 = new cv.Point(face.x, face.y);
    let point2 = new cv.Point(face.x + face.width, face.y + face.height);
    cv.rectangle(dst, point1, point2, [255, 0, 0, 255]);
  }
  cv.imshow(process_video_canvas_output, dst);
  return process_video_canvas_output;
}

const canvas = document.createElement("canvas");

regl.frame(() => {
  cap.read(src);
  console.log(faces);
  cv.onRuntimeInitialized = () => {
    cv.getBuildInformation();
  };

  // cv.cvtColor(frame, gray, cv.CV_8UC4);

  regl.clear({
    color: [0.8, 1, 0.9, 1],
    depth: 1,
  });
  detech_face();
  texture({ data: process_video_canvas_output });
  drawCameta();
});

export {};
