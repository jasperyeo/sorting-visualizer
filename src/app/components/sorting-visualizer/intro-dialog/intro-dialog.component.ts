import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { SortingVisualizerService } from '../sorting-visualizer.service';

@Component({
  selector: 'intro-dialog',
  templateUrl: './intro-dialog.component.html',
  styleUrls: ['./intro-dialog.component.scss']
})
export class IntroDialogComponent implements OnInit {

  @Output('onDialogClose') public onDialogClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  public definition: any = {
    description: null,
    link: null
  }

  constructor(private _sortingVisualizerService: SortingVisualizerService, private _translateService: TranslateService) {}

  public ngOnInit(): void {
    this._sortingVisualizerService.getWikipediaSummary('sorting_algorithm').then((res: any) => {
      if (res) {
        this.definition.description = res.extract;
        if (res.content_urls && res.content_urls.desktop) {
          this.definition.link = res.content_urls.desktop.page;
        }
      }
    });
  }

  public closeDialog(): void {
    this.onDialogClose.emit(true);
  }
}
