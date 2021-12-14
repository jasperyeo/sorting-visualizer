import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public readonly title: string = 'Sorting Visualizer';
  public readonly langs: any[] = [
    { label: 'EN', value: 'en' },
    { label: '中', value: 'zh' },
    { label: 'ES', value: 'es' },
    { label: 'ID', value: 'id' },
  ];
  public isMobileSafari: boolean = false;

  constructor(private _meta: Meta, private _title: Title, private _translateService: TranslateService) {
    this._meta.addTags([
      { name: 'description', content: 'Sorting visualizer that demonstrates the functionality of common sorting algorithms visually, through colors, sounds, and timings.' },
      { name: 'author', content: 'Jasper Yeo' },
      { name: 'keywords', content: 'sorting, angular, sort, sorting-algorithms, sorting-visualization, sorting-visualizer' },
      { name: 'robots', content: 'index, follow' },
      { name: 'date', content: '2021-12-01', scheme: 'YYYY-MM-DD' },
      { charset: 'UTF-8' }
    ]);
    this._title.setTitle(this.title);

    this._translateService.addLangs(this.langs.map(lang => lang.value));
    this._translateService.setDefaultLang('en');
    this._translateService.use('en');

    if (navigator.platform == 'iPhone' || navigator.platform == 'iPod'){
      if (navigator.userAgent.indexOf('Safari') != -1) {
        this.isMobileSafari = true;
      }
    }

    screen.orientation.lock("portrait");
  }
}
