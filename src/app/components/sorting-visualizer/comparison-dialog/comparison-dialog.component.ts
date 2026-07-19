import { Component, OnInit, ChangeDetectionStrategy, ModelSignal, model, input, output, InputSignal, OutputEmitterRef, WritableSignal, signal, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { COMPLEXITY_TIME, COMPLEXITY_SPACE } from '../../../shared/models/complexity-time-space.constants';
import { BigONotationPipe } from '../../../shared/pipes/big-o-notation.pipe';

@Component({
  standalone: true,
  imports: [
    FormsModule,
    TranslatePipe,
    BigONotationPipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'comparison-dialog',
  templateUrl: './comparison-dialog.component.html',
  styleUrls: ['./comparison-dialog.component.scss'],
  host: {
    '(keydown.escape)': 'closeDialog()'
  }
})
export class ComparisonDialogComponent implements OnInit, AfterViewInit {

  public readonly algorithms: InputSignal<any[]> = input<any[]>([]);
  protected readonly onDialogClose: OutputEmitterRef<boolean> = output<boolean>({ alias: 'onDialogClose' });
  protected readonly COMPLEXITY_TIME = COMPLEXITY_TIME;
  protected readonly COMPLEXITY_SPACE = COMPLEXITY_SPACE;
  protected readonly listedAlgorithms: WritableSignal<any[]> = signal<any[]>([]);
  protected readonly filteredAlgorithms: WritableSignal<any[]> = signal<any[]>([]);
  protected readonly sortSearchTerm: ModelSignal<string> = model<string>('');

  public ngOnInit(): void {
    const algorithms = this.algorithms();
    if (algorithms && algorithms.length) {
      algorithms.forEach((cat: any) => {
        if (cat.algorithms && cat.algorithms.length) {
          cat.algorithms.forEach((algo: any) => {
            this.listedAlgorithms.update((algorithms) => [...algorithms, algo]);
          });
        }
      });
    }
    this.filteredAlgorithms.update(() => this.listedAlgorithms());
  }

  public ngAfterViewInit(): void {
    const dialog = document.getElementById('comparison-dialog') as HTMLDialogElement;
    dialog.showModal();
  }

  protected closeDialog(): void {
    this.onDialogClose.emit(true);
  }

  protected search(): void {
    if (!this.sortSearchTerm() || !this.sortSearchTerm().length) {
      this.filteredAlgorithms.update(() => this.listedAlgorithms());
      return;
    }
    this.filteredAlgorithms.update(() => this.listedAlgorithms().filter(algo =>
      (algo.label as string).toUpperCase().includes(this.sortSearchTerm().toUpperCase()) ||
      (algo.category as string).toUpperCase().includes(this.sortSearchTerm().toUpperCase())));
  }
}