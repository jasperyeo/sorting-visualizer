export enum SortBarColor {
  NORMAL = 'null',
  SWAP = 'red',
  PIVOT = 'green'
};

export enum SortBarStyle {
  BAR = 'BAR',
  POINT = 'POINT',
  LINE = 'LINE',
  NUMBER = 'NUMBER',
  BALLOON = 'BALLOON',
  BAMBOO = 'BAMBOO'
};

export const SORT_STYLES = [
  {
    category: 'BASIC',
    styles: [
      SortBarStyle.BAR,
      SortBarStyle.POINT,
      SortBarStyle.LINE,
      SortBarStyle.NUMBER
    ]
  },
  {
    category: 'FANCY',
    styles: [
      SortBarStyle.BALLOON,
      SortBarStyle.BAMBOO
    ]
  }
] as const;

export const SORT_BAR_DEFAULTS = {
  DEFAULT_COLOR: 'turquoise',
  COLOR: SortBarColor.NORMAL,
  STYLE: SortBarStyle.BAR,
  SORT_DELAY: 20,
  VALUE: 100,
  VALUE_STRING: '100',
  SHOW_VALUE: true,
  SHOW_GRADIENT_COLOR: true
} as const;

export interface SortBarInterface {
  id: string;
  defaultColor: string; 
  color: string;
  style: string;
  sortDelay: number;
  value: number;
  valueString: string;
  showValue: boolean;
  showGradientColor: boolean;
};