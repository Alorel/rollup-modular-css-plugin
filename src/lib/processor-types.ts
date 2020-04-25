/** @internal */
import {SourceMap} from 'rollup';

/** @internal */
export interface FileDef {
  exports: Exports;

  result: Result;

  text: string;

  valid: boolean;

  values: { [k: string]: any };
}

/** @internal */
export interface Result {
  css: string;

  map?: SourceMap & { toJSON(): SourceMap };

  opts: { [k: string]: any };

  root: { [k: string]: any };
}

/** @internal */
export interface Details {
  result: Result;

  text: string;

  valid: boolean;

  values: { [k: string]: any };
}

export interface Exports {
  [name: string]: string[];
}

/** @internal */
export interface Files {
  [name: string]: FileDef;
}

/** @internal */
export interface ProcessorOutput {
  details: Details;

  exports: Exports;

  file: string;

  files: Files;

  id: string;
}

/** @internal */
export interface IProcessor {
  files: Files;

  options: {
    cwd: string;
    [k: string]: any;
  };

  dependencies(id: string): string[];

  dependents(id: string): string[];

  has(id: string): boolean;

  invalidate(id: string): void;

  string(id: string, code: string): Promise<ProcessorOutput>;
}
