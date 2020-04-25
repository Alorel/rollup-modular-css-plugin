const uniqueSlug = require('unique-slug'); //tslint:disable-line:no-var-requires

export function makeStyleId(code: string): string {
  return uniqueSlug(code);
}
