import { Component, OnInit } from '@angular/core';

import { SortBarComponent } from './../../shared/models/sort-bar/sort-bar.component';

import { SortingVisualizerService } from './sorting-visualizer.service';

@Component({
  selector: 'sorting-visualizer',
  templateUrl: './sorting-visualizer.component.html',
  styleUrls: ['./sorting-visualizer.component.scss']
})
export class SortingVisualizerComponent implements OnInit {

  public readonly audioContext: AudioContext = new AudioContext();
  public sortArray: SortBarComponent[] = [];
  public sortDelay: number = 20;
  public sortMethod: string = '';
  public sortDescription: string = '';
  public sortLink: string = '';
  public sortAttempts: number = 0;
  public elementCount: number = 400;
  public minValue: number = 5;
  public maxValue: number = 600;
  public noOfCompares: number = 0;
  public noOfSwaps: number = 0;
  public sorting: boolean = false;
  public showControlPanel: boolean = false;
  public showSettings: boolean = true;
  public showStatistics: boolean = true;
  public showInfo: boolean = true;
  public showCredits: boolean = true;
  public enableAudio: boolean = false;
  public showValues: boolean = false;
  
  public sortAlgorithms: any[] = [
    {
      category: 'Logarithmic',
      algorithms: [
        {
          label: 'Quick Sort',
          value: 'quick',
          description: '',
          link: ''
        }
      ]
    }
  ];

  constructor(private _sortingVisualizerService: SortingVisualizerService) { }

  public sleep(delay: number): Promise<void> {
    return new Promise(resolve => {
        setTimeout(resolve, delay);
    });
  }

  public ngOnInit(): void {
    this.resetArray();
    this._scrapAlgorithmInformation();
  }

  private _scrapAlgorithmInformation(): void {
    this.sortAlgorithms.forEach(category => {
      category.algorithms.forEach((algo: any) => {
        this._sortingVisualizerService.getWikipediaSummary(algo.value + 'sort').then((res: any) => {
          if (res) {
            console.log(res);
            algo.description = res.extract;
            if (res.content_urls && res.content_urls.desktop) {
              algo.link = res.content_urls.desktop.page;
            }
          }
        })
      });
    });
  }
 
  private _playBeep(gain: number, hertz: number, ms: number): void {
    const oscillator: OscillatorNode = this.audioContext.createOscillator();
    const createdGain: GainNode = this.audioContext.createGain();
    oscillator.connect(createdGain);
    oscillator.frequency.value = hertz;
    oscillator.type = "square";
    createdGain.connect(this.audioContext.destination);
    createdGain.gain.value = gain * 0.01;
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + ms * 0.001);
  }

  public resetArray(): void {
    if (this.enableAudio) this._playBeep(3, 10, 200);
    this.sortAttempts = 0;
    this.noOfCompares = 0;
    this.noOfSwaps = 0;
    this.sortArray.splice(0);
    for (let i: number = 0; i < this.elementCount; i++) {
      let sortBar: SortBarComponent = new SortBarComponent;
      sortBar.id = 'bar' + i.toString();
      sortBar.sortDelay = this.sortDelay;
      sortBar.value = this._randomNumberFromRange(this.minValue, this.maxValue);
      sortBar.selected = false;
      sortBar.showValue = this.showValues;
      this.sortArray.push(sortBar);
    }
  }

  private _randomNumberFromRange(min: number, max: number) {
    return Math.floor(Math.random() * (max  - min + 1) + min);
  }

  public stop(): void {
    this.sorting = false;
  }

  public selectAlgorithm(mode: string): void {
    this.sortAlgorithms.forEach(category => {
      category.algorithms.forEach((algo: any) => {
        if (algo.value === mode) {
          this.sortDescription = algo.description;
          this.sortLink = algo.link;
        }
      });
    });
  }

  public sort(array: SortBarComponent[], mode: string): void {
    this.sortAttempts++;
    this.sorting = true;
    switch (mode) {
      case 'quick':
        this.quickSort(array, 0, array.length - 1).then(result => this.sorting = false);
        break;
    }
  }

  public compare(array: SortBarComponent[], i: number, j: number): boolean {
    this.noOfCompares++;
    return array[i].value >= array[j].value;
  }

  public async swap(array: SortBarComponent[], i: number, j: number): Promise<void> {
    if (this.enableAudio) this._playBeep(3, array[i].value, 50);
    this.noOfSwaps++;
    array[i].selected = true;
    [array[i], array[j]] = [array[j], array[i]];
    await this.sleep(this.sortDelay);
    array[j].selected = false;
  }

  public async quickSort(array: SortBarComponent[], left: number, right: number): Promise<void> {
    if (left < right) {
      let pivot = left;
      array[pivot].selected = true;
      let i = left;
      let j = right;
      array[j].selected = true;
      while (i < j) {
        if (!this.sorting) return;
        while (this.compare(array, pivot, i) && i < j) {
          array[i].selected = false;
          i++;
          array[i].selected = true;
        }
        while (!this.compare(array, pivot, j)) {
          array[j].selected = false;
          j--;
          array[j].selected = true;
        }
        array[pivot].selected = true;
        if (i < j) {
          await this.swap(array, i, j);
        }
      }
      await this.swap(array, pivot, j);
      array[i].selected = false;
      array[j].selected = false;
      array[pivot].selected = false;
      await this.quickSort(array, left, j - 1);
      await this.quickSort(array, j + 1, right);
    }
  }
}
