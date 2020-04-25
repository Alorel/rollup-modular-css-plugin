import {LOAD_STYLE_LOCATION} from './constants';

/** @internal */
export function resolveBaseImportString(importName: string): string {
  let out = 'import {loadStyle';
  if (importName !== 'loadStyle') {
    out += ` as ${importName}`;
  }

  return `${out}} from ${JSON.stringify(LOAD_STYLE_LOCATION)};\n`;
}
