import resl from "resl";
import { AsyncSubject, BehaviorSubject, firstValueFrom, Subject } from "rxjs";
import { resolveConfig } from "vite";

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

type Manifest<T extends "text" | "binary" | "image" | "video" | "audio", O> = {
  type: "text" | "binary" | "image" | "video" | "audio";
  src: string;
  stream?: boolean; // = false;
  credentials?: boolean; // = false;
  parser: ManifestParser<ManifestParserInput[T], O>;
};

export function reslPromise<T extends Record<string, Manifest<any, any>>>(
  manifests: T
) {
  const obs = new AsyncSubject<{
    [key in keyof T]: T[key] extends Manifest<any, infer O> ? O : never;
  }>();
  const pg = new Subject<[progress: number, message: string]>();
  resl({
    manifest: manifests,
    onDone(out) {
      obs.next(out as any);
      obs.complete();
    },
    onProgress(progress, message) {
      pg.next([progress, message]);
    },
    onError(error) {
      obs.error(error);
    },
  });
  return Object.assign(firstValueFrom(obs), {
    onProgress(cb: (progress: number, message: string) => void) {
      pg.subscribe((o) => cb(o[0], o[1]));
    },
  });
}
