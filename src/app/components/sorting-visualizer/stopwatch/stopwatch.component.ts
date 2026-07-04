import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    standalone: true,
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'stopwatch',
    templateUrl: './stopwatch.component.html',
})
export class StopwatchComponent {

  @Input('display') public display: HTMLElement | null = document.getElementById('stopwatch');
  @Input('delay') public delay: number = 100;
  public value: number = 0;
  public interval: any;
  public isRunning: boolean = false;

  public formatTime(ms: number): string {
    let hours: number | string   = Math.floor(ms / 3600000);
    let minutes: number | string = Math.floor((ms - (hours * 3600000)) / 60000);
    let seconds: number | string = Math.floor((ms - (hours * 3600000) - (minutes * 60000)) / 1000);
    let ds: number = Math.floor((ms - (hours * 3600000) - (minutes * 60000) - (seconds * 1000)) / 100);
    if (hours < 10) {
      hours = "0" + hours;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    return minutes + ':' + seconds + '.' + ds;
  }
  
  public update(): void {
    if (this.isRunning) {
      this.value += this.delay;
    }
    if (this.display) {
      this.display.innerText = this.formatTime(this.value);
    }
  }
  
  public start(): void {
    if (!this.isRunning) {
      this.isRunning = true;
      if (!this.display) {
        this.display = document.getElementById('stopwatch');
      }
      if (!this.interval) {
        let t = this;
        this.interval = setInterval(() => { t.update(); }, this.delay);
      }
    }
  }
  
  public stop(): void {
    if (this.isRunning) {
      this.isRunning = false;
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
    }
  }
  
  public reset(): void {
    this.stop();
    this.value = 0;
    this.update();
  }
}
