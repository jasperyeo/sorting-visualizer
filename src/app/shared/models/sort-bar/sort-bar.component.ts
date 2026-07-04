import { Component, HostListener, input, InputSignal, model, ModelSignal, signal, WritableSignal } from '@angular/core';

export enum SortBarColor {
  NORMAL = 'null',
  SWAP = 'red',
  PIVOT = 'green'
}

export enum SortBarStyle {
  BAR = 'BAR',
  POINT = 'POINT',
  LINE = 'LINE',
  NUMBER = 'NUMBER',
  BALLOON = 'BALLOON',
  BAMBOO = 'BAMBOO'
}
@Component({
  standalone: true,
  selector: 'sort-bar',
  templateUrl: './sort-bar.component.html',
  styleUrls: ['./sort-bar.component.scss']
})
export class SortBarComponent  {

  public id: ModelSignal<string> = model<string>('');
  public defaultColor: ModelSignal<string> = model<string>('turquoise');
  public color: ModelSignal<string> = model<string>(SortBarColor.NORMAL);
  public style: ModelSignal<string> = model<string>(SortBarStyle.BAR);
  public sortDelay: ModelSignal<number> = model<number>(20);
  public value: ModelSignal<number> = model<number>(100);
  public valueString: ModelSignal<string> = model<string>('100');
  public showValue: ModelSignal<boolean> = model<boolean>(true);
  public showGradientColor: ModelSignal<boolean> = model<boolean>(true);
  public hoverValue: WritableSignal<boolean> = signal<boolean>(false);

  @HostListener('mouseover')
  public hoverShowValue(): void {
    this.hoverValue.update(() => true);
  }

  @HostListener('mouseout')
  public hoverHideValue(): void {
    this.hoverValue.update(() => false);
  }

}