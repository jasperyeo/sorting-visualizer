import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { SortingVisualizerService } from '../sorting-visualizer.service';
import { complexityTime, complexitySpace } from './../../../shared/models/complexity-time-space';

@Component({
  selector: 'comparison-dialog',
  templateUrl: './comparison-dialog.component.html',
  styleUrls: ['./comparison-dialog.component.scss']
})
export class ComparisonDialogComponent implements OnInit {

  @Input('algorithms') public algorithms: any[] = [];
  @Output('onDialogClose') public onDialogClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  public readonly complexityTime = complexityTime;
  public readonly complexitySpace = complexitySpace;
  public listedAlgorithms: any[] = [];
  public filteredAlgorithms: any[] = [];
  public sortSearchTerm: string = '';

  constructor(private _sortingVisualizerService: SortingVisualizerService, private _translateService: TranslateService) {}

  public ngOnInit(): void {
    if (this.algorithms && this.algorithms.length) {
      this.algorithms.forEach((cat: any) => {
        if (cat.algorithms && cat.algorithms.length) {
          cat.algorithms.forEach((algo: any) => {
            this.listedAlgorithms.push(algo);
          });
        }
      });
    }
    this.filteredAlgorithms = this.listedAlgorithms;
  }

  public closeDialog(): void {
    this.onDialogClose.emit(true);
  }

  public search(): void {
    if (!this.sortSearchTerm || !this.sortSearchTerm.length) {
      this.filteredAlgorithms = this.listedAlgorithms;
      return;
    }
    this.filteredAlgorithms = this.listedAlgorithms.filter(algo => (algo.label as string).toUpperCase().includes(this.sortSearchTerm.toUpperCase()) || (algo.category as string).toUpperCase().includes(this.sortSearchTerm.toUpperCase()));
  }
}