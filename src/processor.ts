import * as Processor from '@modular-css/processor';
import {createFilter} from '@rollup/pluginutils';
import {Plugin, PluginContext, SourceDescription} from 'rollup';
import {CommonOptions} from './lib/CommonOptions';
import {DEFAULT_INCLUDE_REGEX, PROCESSOR_PLUGIN_NAME, SRC_MAP_URL_REGEX} from './lib/constants';
import {Exports, IProcessor, ProcessorOutput} from './lib/processor-types';

interface Options extends CommonOptions {
  processorConfig?: { [k: string]: any };
}

interface ModularCssProcessorPlugin extends Plugin {
  exportsByFile: { [id: string]: Exports };
}

function modularCssProcessorPlugin(opts: Options = {}) {
  const {
    exclude,
    include = DEFAULT_INCLUDE_REGEX,
    processorConfig = {},
    sourceMap = true
  } = opts;

  const filter = createFilter(include, exclude);

  const processor: IProcessor = new Processor(Object.freeze({
    ...processorConfig,
    map: sourceMap ? {inline: false} : false
  }));

  function doInvalidate(id: string): void {
    if (processor.has(id)) {
      processor.invalidate(id);
      processor.dependents(id).forEach(doInvalidate);
    }
  }

  const exportsByFile: { [id: string]: Exports } = {};

  return {
    buildStart(this: PluginContext): void {
      /*
       * done lifecycle won't ever be called on per-component styles since
       * it only happens at bundle compilation time
       */
      if (processorConfig.done) {
        this.warn('done processor step will never run - use before()');
      }

      // Watch any files already in the processor
      for (const f of Object.keys(processor.files)) {
        this.addWatchFile(f);
      }
    },
    exportsByFile,
    name: PROCESSOR_PLUGIN_NAME,
    async transform(this: PluginContext, code, id): Promise<null | SourceDescription> {
      if (!filter(id)) {
        return null;
      }

      let processorOutput: ProcessorOutput;
      try {
        processorOutput = await processor.string(id, code);
      } catch (e) {
        // Replace the default message with the much more verbose one
        e.message = e.toString();

        this.error(e);

        return null;
      }

      for (const dep of processor.dependencies(id)) {
        this.addWatchFile(dep);
      }

      const file = processorOutput.files[processorOutput.file];
      exportsByFile[id] = file.exports || null;

      const {css, map} = file.result;

      return {
        code: css.replace(SRC_MAP_URL_REGEX, ''),
        map: map ? map.toJSON() : {mappings: ''}
      };
    },
    watchChange(id) {
      doInvalidate(id);
    }
  };
}

export {
  ModularCssProcessorPlugin,
  modularCssProcessorPlugin,
  Options as ModularCssProcessorOptions
};
