import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public readonly title: string = 'sorting-visualizer';
  public readonly langs: any[] = [
    { label: 'English', value: 'en' },
    { label: '中文', value: 'zh' },
    { label: 'Español', value: 'es' },
    { label: 'Bahasa', value: 'id' },
  ];

  constructor(private _translateService: TranslateService) {
    this._translateService.addLangs(this.langs.map(lang => lang.value));
    this._translateService.setDefaultLang('en');
    this._translateService.use('en');
  }
}
