import { Component, OnInit, ChangeDetectionStrategy, WritableSignal, signal, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    standalone: true,
    imports: [
      TranslatePipe
    ],
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'intro-dialog',
    templateUrl: './intro-dialog.component.html',
    styleUrls: ['./intro-dialog.component.scss'],
})
export class IntroDialogComponent implements OnInit {

  public readonly onDialogClose = output<boolean>({ alias: 'onDialogClose' });
  public currentYear: WritableSignal<number> = signal<number>(2022);

  public ngOnInit(): void {
    this.currentYear.update(() => new Date().getFullYear());
  }

  public closeDialog(): void {
    this.onDialogClose.emit(true);
  }
}
