/** @internal */
export const STR_START = '// ========== BEGIN loadStyle BLOCK ==========';

/** @internal */
export const STR_END = '// ========== END loadStyle BLOCK ==========';

/** @internal */
export const LOAD_STYLE_SOURCE_REGEX = /\/\/ ========== loadStyleSrc: (.+)$/m;

/** @internal */
export const SRC_MAP_URL_REGEX = /^\/\*#\ssourceMappingURL=.+$/gm;

/** @internal */
export const SRC_MAP_GET_REGEX = /^\/\*#\ssourceMappingURL=data:application\/json;base64,([a-zA-Z0-9=+\/]+)/;

/** @internal */
export const LOAD_STYLE_LOCATION = '@alorel/rollup-plugin-modular-css/loadStyle.js';

/** @internal */
export const PROCESSOR_PLUGIN_NAME = 'modular-css-plugin-processor';

/** @internal */
export const EXPORTER_PLUGIN_NAME = 'modular-css-plugin-exporter';

/** @internal */
export const DEFAULT_INCLUDE_REGEX = /\.(s[ac]|c)ss$/;
