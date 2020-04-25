import {relative} from 'path';

/** @internal */
let osAwareRelative: typeof relative;

if (process.platform === 'win32') {
  const regSearch = /\\/g;

  osAwareRelative = (from, to) => relative(from, to).replace(regSearch, '/');
} else {
  osAwareRelative = relative;
}

export {osAwareRelative};
