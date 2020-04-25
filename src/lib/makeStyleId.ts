import {createHash} from 'crypto';

const reg = /([=\/+])/g;
//tslint:disable:object-literal-sort-keys
const replacements = {
  '/': '.',
  '+': '-',
  '=': '_'
};
//tslint:enable:object-literal-sort-keys

/** Replace some base64 chars with valid ID characters */
function makeStyleIdReplacer(m: string): string {
  return replacements[m] || m;
}

/** @internal */
export function makeStyleId(code: string): string {
  return createHash('md5')
    .update(code)
    .digest('base64')
    .replace(reg, makeStyleIdReplacer);
}
