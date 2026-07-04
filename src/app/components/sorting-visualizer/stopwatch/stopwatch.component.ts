import { Component, ChangeDetectionStrategy, input, model, ModelSignal, InputSignal, signal, WritableSignal, computed } from '@angular/core';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'stopwatch',
  templateUrl: './stopwatch.component.html',
})
export class StopwatchComponent {

  protected readonly display: ModelSignal<HTMLElement | null> = model<HTMLElement | null>(document.getElementById('stopwatch'));
  protected readonly delay: InputSignal<number> = input<number>(100);
  protected value: WritableSignal<number> = signal<number>(0);
  protected interval: WritableSignal<any> = signal<any>(null);
  protected isRunning: WritableSignal<boolean> = signal<boolean>(false);

  public formatTime(ms: number): string {
    const hours: WritableSignal<number>   = signal<number>(Math.floor(ms / 3600000));
    const minutes: WritableSignal<number> = signal<number>(Math.floor((ms - (hours() * 3600000)) / 60000));
    const seconds: WritableSignal<number> = signal<number>(Math.floor((ms - (hours() * 3600000) - (minutes() * 60000)) / 1000));
    const ds: WritableSignal<number> = signal<number>(Math.floor((ms - (hours() * 3600000) - (minutes() * 60000) - (seconds() * 1000)) / 100));
    const formattedTime = computed(() => ( minutes() < 10 ? "0" + minutes() : minutes() ) + ':' + ( seconds() < 10 ? "0" + seconds() : seconds() ) + '.' + ( ds() < 10 ? "0" + ds() : ds() ));
    return formattedTime();
  }
  
  public update(): void {
    if (this.isRunning()) {
      this.value.update((v) => v + this.delay());
    }
    const display = this.display();
    if (display) {
      display.innerText = this.formatTime(this.value());
    }
  }
  
  public start(): void {
    if (!this.isRunning()) {
      this.isRunning.update(() => true);
      if (!this.display()) {
        this.display.update(() => document.getElementById('stopwatch'));
      }
      if (!this.interval()) {
        const t = this;
        this.interval.update(() => setInterval(() => { t.update(); }, this.delay()));
      }
    }
  }
  
  public stop(): void {
    if (this.isRunning()) {
      this.isRunning.update(() => false);
      if (this.interval()) {
        clearInterval(this.interval());
        this.interval.update(() => null);
      }
    }
  }
  
  public reset(): void {
    this.stop();
    this.value.update(() => 0);
    this.update();
  }
}
