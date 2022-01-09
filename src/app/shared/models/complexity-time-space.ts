enum ComplexityColorCode {
  NORMAL = 'white',
  GOOD = '#D5ECC2',
  AVERAGE = '#FFD3B4',
  BAD = '#FFAAA7'
}

export const complexityTime: Map<string, string> = new Map([
  ['n', ComplexityColorCode.GOOD],
  ['nlogn', ComplexityColorCode.GOOD],
  ['n · (k/d)', ComplexityColorCode.GOOD],
  ['n + k', ComplexityColorCode.GOOD],
  
  ['log^(2)n', ComplexityColorCode.AVERAGE],
  ['nlog^(2)n', ComplexityColorCode.AVERAGE],
  ['n^(4/3)', ComplexityColorCode.AVERAGE],
  ['n^(3/2)', ComplexityColorCode.AVERAGE],

  ['n^(log3/log1.5)', ComplexityColorCode.BAD],
  ['nlog^(n)', ComplexityColorCode.BAD],
  ['n^(2)', ComplexityColorCode.BAD],
  ['n^(2) · k', ComplexityColorCode.BAD],
  ['(n · n!)', ComplexityColorCode.BAD],
  ['infinity', ComplexityColorCode.BAD],
]);

export const complexitySpace: Map<string, string> = new Map([
  ['1', ComplexityColorCode.GOOD],

  ['logn', ComplexityColorCode.AVERAGE],
  
  ['n', ComplexityColorCode.BAD],
  ['n + 2^(d)', ComplexityColorCode.BAD]
]);