import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public readonly title: string = 'Sorting Visualizer | Jasper Yeo';
  public readonly langs: any[] = [
    { label: 'EN', value: 'en' },
    { label: '中', value: 'zh' },
    { label: 'ES', value: 'es' },
    { label: 'ID', value: 'id' },
    { label: 'FR', value: 'fr' }
  ];
  public isMobileSafari: boolean = false;

  constructor(private _meta: Meta, private _title: Title, private _translateService: TranslateService) {
    this._title.setTitle(this.title);

    this._translateService.addLangs(this.langs.map(lang => lang.value));
    this._translateService.setDefaultLang('en');
    this._translateService.use('en');

    if (navigator.platform == 'iPhone' || navigator.platform == 'iPod'){
      if (navigator.userAgent.indexOf('Safari') != -1) {
        this.isMobileSafari = true;
      }
    }
  }
}
