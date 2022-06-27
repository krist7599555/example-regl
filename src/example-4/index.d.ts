declare module "opencv-ts" {
  export type {
    Mat,
    Size,
    Point,
    Range,
    Scalar,
    Rect,
    Vertex,
    QuadEdge,
    Subdiv2D,
    BackgroundSubtractor,
    BackgroundSubtractorMOG2,
    TermCriteria,
    MatVector,
    RotatedRect,
    BorderTypes,
  } from "opencv-ts/src/opencv";
  type Mat = import("opencv-ts/src/opencv").Mat;
  type Rect = import("opencv-ts/src/opencv").Rect;
  type InstanceClass<T> = {
    new (...args: any): T;
  };
  type UnknowFunction = (...args: any[]) => any;
  class RectVector {
    constructor();
    size: () => number;
    get: (index: number) => Rect;
    push_back: UnknowFunction;
    resize: UnknowFunction;
    set: UnknowFunction;
  }

  class CascadeClassifier {
    load(cascade_file: string): void;
    detectMultiScale(
      src: Mat,
      faces: RectVector,
      a: number,
      b: number,
      c: number
    );
  }
  const cv: typeof import("opencv-ts/src/opencv").default & {
    RectVector: InstanceClass<RectVector>;
    CascadeClassifier: InstanceClass<CascadeClassifier>;
    getBuildInformation: () => any;
    FS_createDataFile(
      url: string,
      path: string,
      data: ArrayBuffer,
      a: boolean,
      b: boolean,
      c: boolean
    ): void;
    [x: string]: any;
  };
  export default cv;
}
