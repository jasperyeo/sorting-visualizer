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
  public currentYear: number = 2022;

  constructor(private _sortingVisualizerService: SortingVisualizerService, private _translateService: TranslateService) {}

  public ngOnInit(): void {
    this.currentYear = new Date().getFullYear();
  }

  public closeDialog(): void {
    this.onDialogClose.emit(true);
  }
}
