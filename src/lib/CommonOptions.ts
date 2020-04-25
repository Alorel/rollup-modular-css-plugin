import {FilterPattern} from '@rollup/pluginutils';

export interface CommonOptions {
  exclude?: FilterPattern;

  include?: FilterPattern;

  sourceMap?: boolean;
}
