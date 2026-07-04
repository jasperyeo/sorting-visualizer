import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectionStrategy, ModelSignal, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { complexityTime, complexitySpace } from './../../../shared/models/complexity-time-space';
import { BigONotationPipe } from '../../../shared/pipes/big-o-notation.pipe';

@Component({
  standalone: true,
  imports: [
    FormsModule,
    TranslatePipe,
    BigONotationPipe
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
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
  public sortSearchTerm: ModelSignal<string> = model<string>('');

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
    if (!this.sortSearchTerm() || !this.sortSearchTerm().length) {
      this.filteredAlgorithms = this.listedAlgorithms;
      return;
    }
    this.filteredAlgorithms = this.listedAlgorithms.filter(algo => (algo.label as string).toUpperCase().includes(this.sortSearchTerm().toUpperCase()) || (algo.category as string).toUpperCase().includes(this.sortSearchTerm().toUpperCase()));
  }
}