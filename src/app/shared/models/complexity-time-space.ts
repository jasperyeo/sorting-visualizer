import { ComplexityColorCode } from './complexity-color-code';

export const complexityTime: Map<string, string> = new Map([
  ['n', ComplexityColorCode.GOOD],
  ['nlogn', ComplexityColorCode.GOOD],

  ['n^(2)', ComplexityColorCode.BAD]
]);

export const complexitySpace: Map<string, string> = new Map([
  ['1', ComplexityColorCode.GOOD],
  ['logn', ComplexityColorCode.AVERAGE],
  ['n', ComplexityColorCode.BAD]
]);