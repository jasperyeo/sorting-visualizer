import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SortingVisualizerComponent } from './components/sorting-visualizer/sorting-visualizer.component';

@Component({
  standalone: true,
  imports: [
    SortingVisualizerComponent
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

  public isMobileSafari: WritableSignal<boolean> = signal<boolean>(false);
  private _translateService: TranslateService = inject(TranslateService);
  public readonly langs: any[] = [
    { label: 'EN', value: 'en' },
    { label: '中', value: 'zh' },
    { label: 'ES', value: 'es' },
    { label: 'ID', value: 'id' },
    { label: 'FR', value: 'fr' }
  ];

  constructor() {
    this._translateService.addLangs(this.langs.map(lang => lang.value));
    this._translateService.use('en');

    if (navigator.platform == 'iPhone' || navigator.platform == 'iPod'){
      if (navigator.userAgent.indexOf('Safari') != -1) {
        this.isMobileSafari.update(() => true);
      }
    }
  }
}