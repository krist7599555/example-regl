import type {
  Regl,
  DynamicVariable,
  DrawConfig,
  DefaultContext,
  DrawCommand,
} from "regl";

export type ReglProp<Props extends object> = {
  prop: <T extends keyof Props>(key: T) => DynamicVariable<Props[T]>;
};

export function createReglCommand<
  O extends { props?: object; uniform?: object; attributes?: object }
>(
  regl: Regl,
  config: (
    regl: Regl & ReglProp<Exclude<O["props"], undefined>>
  ) => DrawConfig<
    Exclude<O["uniform"], undefined>,
    Exclude<O["attributes"], undefined>,
    Exclude<O["props"], undefined>
  >
): DrawCommand<DefaultContext, Exclude<O["props"], undefined>> {
  return regl(config(regl as any));
}
