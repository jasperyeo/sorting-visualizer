import { Component, HostListener, Input, OnInit } from '@angular/core';

@Component({
  selector: 'sort-bar',
  templateUrl: './sort-bar.component.html',
  styleUrls: ['./sort-bar.component.scss']
})
export class SortBarComponent implements OnInit {

  @Input('id') public id: string = '';
  @Input('color') public color: string = 'turquoise';
  @Input('sortDelay') public sortDelay: number = 20;
  @Input('value') public value: number = 100;
  @Input('showValue') public showValue: boolean = true;
  public hoverValue: boolean = false;

  constructor() {}

  public ngOnInit(): void {}

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