import {InputOptions, Plugin} from 'rollup';
import {ModularCssProcessorPlugin} from '../processor';
import {PROCESSOR_PLUGIN_NAME} from './constants';

/** @internal */
export function findMainPlugin(opts: InputOptions): ModularCssProcessorPlugin | null {
  return opts.plugins?.find((p: Plugin): p is ModularCssProcessorPlugin => !!p && p.name === PROCESSOR_PLUGIN_NAME)
    || null;
}
