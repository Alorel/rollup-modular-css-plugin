import {TransformPluginContext} from 'rollup';

/** @internal */
export function inlineSourceMap(ctx: TransformPluginContext): string {
  const json = JSON.stringify(ctx.getCombinedSourcemap());
  const base64 = Buffer.from(json, 'utf8').toString('base64');

  return `/*# sourceMappingURL=data:application/json;base64,${base64} */`;
}
