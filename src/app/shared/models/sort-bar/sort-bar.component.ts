import { Component, HostListener, Input } from '@angular/core';

@Component({
  selector: 'sort-bar',
  templateUrl: './sort-bar.component.html',
  styleUrls: ['./sort-bar.component.scss']
})
export class SortBarComponent  {

  @Input('id') public id: string = '';
  @Input('color') public color: string = SortBarColor.NORMAL;
  @Input('style') public style: string = SortBarStyle.BAR;
  @Input('sortDelay') public sortDelay: number = 20;
  @Input('value') public value: number = 100;
  @Input('valueString') public valueString: string = '100';
  @Input('showValue') public showValue: boolean = true;
  public hoverValue: boolean = false;

  constructor() {}

  @HostListener('mouseover')
  public hoverShowValue(): void {
    this.hoverValue = true;
  }

  @HostListener('mouseout')
  public hoverHideValue(): void {
    this.hoverValue = false;
  }

}

export enum SortBarColor {
  NORMAL = 'turquoise',
  SWAP = 'red',
  PIVOT = 'green'
}

export enum SortBarStyle {
  BAR = 'bar',
  POINT = 'point',
  BALLOON = 'balloon'
}