import { ChangeDetectionStrategy, Component, model, ModelSignal, signal, WritableSignal } from '@angular/core';
import { SORT_BAR_DEFAULTS, SortBarColor, SortBarStyle } from './sort-bar.constants';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sort-bar',
  templateUrl: './sort-bar.component.html',
  styleUrls: ['./sort-bar.component.scss'],
  host: {
    '(mouseover)': 'hoverShowValue()',
    '(mouseout)': 'hoverHideValue()'
  }
})
export class SortBarComponent  {

  public id: ModelSignal<string> = model<string>('');
  public defaultColor: ModelSignal<string> = model<string>(SORT_BAR_DEFAULTS.DEFAULT_COLOR);
  public color: ModelSignal<string> = model<string>(SORT_BAR_DEFAULTS.COLOR);
  public style: ModelSignal<string> = model<string>(SORT_BAR_DEFAULTS.STYLE);
  public sortDelay: ModelSignal<number> = model<number>(SORT_BAR_DEFAULTS.SORT_DELAY);
  public value: ModelSignal<number> = model<number>(SORT_BAR_DEFAULTS.VALUE);
  public valueString: ModelSignal<string> = model<string>(SORT_BAR_DEFAULTS.VALUE_STRING);
  public showValue: ModelSignal<boolean> = model<boolean>(SORT_BAR_DEFAULTS.SHOW_VALUE);
  public showGradientColor: ModelSignal<boolean> = model<boolean>(SORT_BAR_DEFAULTS.SHOW_GRADIENT_COLOR);
  public hoverValue: WritableSignal<boolean> = signal<boolean>(false);

  public hoverShowValue(): void {
    this.hoverValue.update(() => true);
  }

  public hoverHideValue(): void {
    this.hoverValue.update(() => false);
  }

}