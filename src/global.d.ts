declare module "bunny" {
  type Vec3 = [number, number, number];
  const bunny: { position: Vec3[]; cells: Vec3[] };
  export default bunny;
}

declare module "glslify" {
  // Tagged Templates
  const glsl: (raw: TemplateStringsArray, ...args: any[]) => string;
  export default glsl;
}

declare module "*?url" {
  const url: string;
  export default url;
}

declare module "resl" {
  type ManifestParser<I, O> =
    | ((data: I) => O)
    | { onData: (data: I) => O; onDone?: () => void };

  type ManifestParserInput = {
    text: string;
    binary: ArrayBuffer;
    image: HTMLImageElement;
    video: any;
    audio: any;
  };

  type Manifest<
    T extends "text" | "binary" | "image" | "video" | "audio",
    O
  > = {
    type: T;
    src: string;
    stream?: boolean; // = false;
    credentials?: boolean; // = false;
    parser: ManifestParser<ManifestParserInput[T], O>;
  };

  type Config<Mani extends Record<string, Manifest<any, any>>> = {
    manifest: Mani;
    onDone: (assets: {
      [key in keyof Mani]: Mani[key]["parser"] extends ManifestParser<
        any,
        infer O
      >
        ? O
        : any;
    }) => void;
    onProgress?: (progress, message) => void;
    onError?: (error: Error) => void;
  };
  const loader: <T extends Config<Record<string, Manifest<any, any>>>>(
    config: T
  ) => void;
  export default loader;
}
