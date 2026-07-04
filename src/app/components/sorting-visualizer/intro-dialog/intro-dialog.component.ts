import { Component, OnInit, ChangeDetectionStrategy, WritableSignal, signal, output, OutputEmitterRef } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  standalone: true,
  imports: [
    TranslatePipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'intro-dialog',
  templateUrl: './intro-dialog.component.html',
  styleUrls: ['./intro-dialog.component.scss'],
})
export class IntroDialogComponent implements OnInit {

  protected readonly onDialogClose: OutputEmitterRef<boolean> = output<boolean>({ alias: 'onDialogClose' });
  protected readonly currentYear: WritableSignal<number> = signal<number>(2026);

  public ngOnInit(): void {
    this.currentYear.update(() => new Date().getFullYear());
  }

  protected closeDialog(): void {
    this.onDialogClose.emit(true);
  }
}
