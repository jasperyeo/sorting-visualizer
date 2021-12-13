import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bigONotation'
})
export class BigONotationPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    if (!value || !value.length) return '';
    let finalString: string = value;
    // infinity
    if (value === 'infinity') {
      finalString = '&#8734;';
    }
    // superscript at '^(#)'
    if (value.includes('^')) {
      finalString = finalString.replace(/(\^\()/gi, '<sup>');
      finalString = finalString.replace(/(\))/gi, '</sup>');
    }
    // fractional value
    if (value.includes('/')) {
      const startIndex: number = finalString.indexOf('(');
      const divisorIndex: number = finalString.indexOf('/');
      const endIndex: number = finalString.indexOf(')');
      const prefix: string = '<div class="whole">' + finalString.substring(0, startIndex) + '</div>';
      const suffix: string = finalString.substring(endIndex + 1, finalString.length);
      const numerator: string = finalString.substring(startIndex + 1, divisorIndex);
      const denominator: string = finalString.substring(divisorIndex + 1, endIndex);

      finalString = prefix + '<div class="fr"><div class="fr__top">' + numerator + '</div><div class="fr__bottom">' + denominator + '</div></div>' + suffix;
    }
    // italics at 'n'
    finalString = finalString.replace(/(n)/gi, '<i>n</i>');
    return finalString;
  }
}
