import { ComplexityColorCode } from './complexity-color-code';

export const complexityTime: Map<string, string> = new Map([
  ['n', ComplexityColorCode.GOOD],
  ['nlogn', ComplexityColorCode.GOOD],
  ['n · (k/d)', ComplexityColorCode.GOOD],
  
  ['log^(2)n', ComplexityColorCode.AVERAGE],
  ['nlog^(2)n', ComplexityColorCode.AVERAGE],
  ['n^(4/3)', ComplexityColorCode.AVERAGE],
  ['n^(3/2)', ComplexityColorCode.AVERAGE],

  ['nlog^(n)', ComplexityColorCode.BAD],
  ['n^(2)', ComplexityColorCode.BAD],
  ['(n · n!)', ComplexityColorCode.BAD],
  ['infinity', ComplexityColorCode.BAD],
]);

export const complexitySpace: Map<string, string> = new Map([
  ['1', ComplexityColorCode.GOOD],

  ['logn', ComplexityColorCode.AVERAGE],
  
  ['n', ComplexityColorCode.BAD],
  ['n + 2^(d)', ComplexityColorCode.BAD]
]);