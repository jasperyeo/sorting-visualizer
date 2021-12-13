import { ComplexityColorCode } from './complexity-color-code';

export const complexityTime: Map<string, string> = new Map([
  ['n', ComplexityColorCode.GOOD],
  ['nlogn', ComplexityColorCode.GOOD],
  ['n · (k/d)', ComplexityColorCode.GOOD],
  
  ['nlog^(2)n', ComplexityColorCode.AVERAGE],

  ['n^(2)', ComplexityColorCode.BAD],
  ['(n · n!)', ComplexityColorCode.BAD],
  ['infinity', ComplexityColorCode.BAD]
]);

export const complexitySpace: Map<string, string> = new Map([
  ['1', ComplexityColorCode.GOOD],
  ['logn', ComplexityColorCode.AVERAGE],
  ['n', ComplexityColorCode.BAD]
]);