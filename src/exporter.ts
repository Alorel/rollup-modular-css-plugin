import {createFilter} from '@rollup/pluginutils';
import {camelCase} from 'lodash';
import {relative} from 'path';
import {Plugin, PluginContext, TransformPluginContext, TransformResult} from 'rollup';
import {CommonOptions} from './lib/CommonOptions';
import {DEFAULT_INCLUDE_REGEX, EXPORTER_PLUGIN_NAME} from './lib/constants';
import {findMainPlugin} from './lib/findMainPlugin';
import {inlineSourceMap} from './lib/inlineSourceMap';
import {lazyValue} from './lib/lazy-value';
import {makeStyleId} from './lib/makeStyleId';
import {resolveBaseImportString} from './lib/resolveBaseImportString';
import {ModularCssProcessorPlugin} from './processor';

const regVarName = /^[a-z\d_]+$/i;

interface Options extends CommonOptions {
  /** @default false */
  preferConst?: boolean;

  /**
   * True (default) means CSS won't be included in the output if nothing is imported from the file
   */
  pureLoadStyle?: boolean;

  /**
   * What to export the transpiled stylesheet as. null = don't export
   * @default null
   */
  styleExportName?: string | null | false;

  /**
   * null = don't use loadStyle, string = use loadStyle
   * Made it configurable in case you need to have a css rule named "loadStyle" for whatever reason
   * @default null
   */
  styleImportName?: string | null | false;

  /**
   * Warn on CSS rule names that aren't valid JS identifiers
   * @default false
   */
  warnOnInvalidNames?: boolean;
}

function modularCssExporterPlugin(pluginOptions: Options = {}): Plugin {
  const {
    exclude,
    include = DEFAULT_INCLUDE_REGEX,
    preferConst = false,
    pureLoadStyle = true,
    sourceMap = true,
    warnOnInvalidNames = false,
    styleExportName = null,
    styleImportName = null
  } = pluginOptions;

  const filter = createFilter(include, exclude);
  const exportVarName = preferConst ? 'const' : 'var';

  let styleImportHeader: string;
  let styleLoadCall: string;

  let mainPlugin: ModularCssProcessorPlugin;

  if (styleImportName) {
    styleImportHeader = resolveBaseImportString(styleImportName);
    styleLoadCall = pureLoadStyle ? `/*@__PURE__*/${styleImportName}` : styleImportName;
  }

  return {
    buildStart(this: PluginContext, inputOptions) {
      if (!mainPlugin) {
        mainPlugin = findMainPlugin(inputOptions)!;
        if (!mainPlugin) {
          this.error('Can\'t proceed without the processor plugin.');
        }
      }
    },
    name: EXPORTER_PLUGIN_NAME,
    transform(this: TransformPluginContext, code, id): TransformResult {
      if (!mainPlugin.exportsByFile[id] || !filter(id)) {
        return null;
      }

      const lines: string[] = [];

      const styleBody = lazyValue<string>(sourceMap ? () => `${code}\n${inlineSourceMap(this)}` : () => code);

      if (styleImportHeader) {
        const styleId = makeStyleId(code);

        lines.push(
          styleImportHeader,
          `${styleLoadCall}("${styleId}", ${JSON.stringify(styleBody())});\n`
        );
      }

      const fileExports = Object.entries(mainPlugin.exportsByFile[id] || {});
      if (fileExports.length) {
        for (let [key, exportArray] of fileExports) {
          if (exportArray.length !== 1) {
            this.error(`More than one export for ${key} found in ${id}: ${exportArray.join(', ')}`);
          }
          if (!regVarName.test(key)) {
            const camelCased = camelCase(key);
            warnOnInvalidNames && this.warn(`${key} in ${relative(process.cwd(), id)} camelCased to ${camelCased}`);
            key = camelCased;
          }
          lines.push(`export ${exportVarName} ${key} = ${JSON.stringify(exportArray[0])};`);
        }
        lines.push('');
      }

      if (styleExportName) {
        const exportStr = styleExportName === 'default' ? 'default' : `${exportVarName} ${styleExportName} =`;
        lines.push(`export ${exportStr} ${JSON.stringify(styleBody())};\n`);
      }

      if (!lines.length) {
        return null;
      }

      return {
        code: lines.join('\n'),
        map: {mappings: ''}
      };
    }
  };
}

export {
  modularCssExporterPlugin,
  Options as ModularCssExporterPluginOptions
};
