import { Component, HostListener, OnInit } from '@angular/core';

import { SortBarColor, SortBarComponent } from './../../shared/models/sort-bar/sort-bar.component';

import { SortingVisualizerService } from './sorting-visualizer.service';

@Component({
  selector: 'sorting-visualizer',
  templateUrl: './sorting-visualizer.component.html',
  styleUrls: ['./sorting-visualizer.component.scss']
})
export class SortingVisualizerComponent implements OnInit {

  public readonly audioContext: AudioContext = new AudioContext();
  public sortArray: SortBarComponent[] = [];
  public sortDelay: number = 50;
  public sortMethod: string = '';
  public sortDescription: string = '';
  public sortLink: string = '';
  public sortAttempts: number = 0;
  public elementCount: number = 400;
  public minValue: number = 5;
  public maxValue: number = 600;
  public noOfCompares: number = 0;
  public noOfSwaps: number = 0;
  public viewWidth: number = 0;
  public viewHeight: number = 0;
  public sorting: boolean = false;
  public showControlPanel: boolean = true;
  public showSettings: boolean = true;
  public showStatistics: boolean = true;
  public showInfo: boolean = true;
  public showCredits: boolean = true;
  public enableAudio: boolean = false;
  public showValues: boolean = false;
  
  public sortAlgorithms: any[] = [
    {
      category: 'Partitioning',
      algorithms: [
        {
          label: 'Quick Sort',
          value: 'quick',
          description: '',
          link: ''
        }
      ]
    },
    {
      category: 'Merging',
      algorithms: [
        {
          label: 'Merge Sort',
          value: 'merge',
          description: '',
          link: ''
        }
      ]
    },
    {
      category: 'Exchanging',
      algorithms: [
        {
          label: 'Bubble Sort',
          value: 'bubble',
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
    this.viewWidth = window.innerWidth;
    this.viewHeight = window.innerHeight;
    this.elementCount = Math.floor(this.viewWidth / 14);
    this.maxValue = Math.floor(this.viewHeight * 0.45);
    this.resetArray();
    this._scrapAlgorithmInformation();
  }

  @HostListener('window:resize')
  @HostListener('window:orientation')
  public windowChange(): void {
    this.viewWidth = window.innerWidth;
    this.viewHeight = window.innerHeight;
    this.elementCount = Math.floor((this.viewWidth / 4) * 0.75);
    this.maxValue = Math.floor(this.viewHeight * 0.45);
    this.resetArray();
  }

  private _scrapAlgorithmInformation(): void {
    this.sortAlgorithms.forEach(category => {
      if (category === 'Library') return;
      category.algorithms.forEach((algo: any) => {
        this._sortingVisualizerService.getWikipediaSummary(algo.value + 'sort').then((res: any) => {
          if (res) {
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
        this.quickSort(array, 0, array.length - 1).then(() => this.sorting = false);
        break;
      case 'merge':
        this.mergeSort(array, 0, array.length).then(() => this.sorting = false);
        break;
      case 'bubble':
        this.bubbleSort(array).then(() => this.sorting = false);
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
    array[i].color = SortBarColor.SWAP;
    [array[i], array[j]] = [array[j], array[i]];
    await this.sleep(this.sortDelay);
    array[j].color = SortBarColor.NORMAL;
  }

  public async quickSort(array: SortBarComponent[], left: number, right: number): Promise<void> {
    if (left < right) {
      const pivot: number = left;
      array[pivot].color = SortBarColor.PIVOT;
      let i: number = left, j: number = right;
      array[j].color = SortBarColor.SWAP;
      while (i < j) {
        if (!this.sorting) return;
        while (this.compare(array, pivot, i) && i < j) {
          array[i].color = SortBarColor.NORMAL;
          i++;
          array[i].color = SortBarColor.SWAP;
        }
        while (!this.compare(array, pivot, j)) {
          array[j].color = SortBarColor.NORMAL;
          j--;
          array[j].color = SortBarColor.SWAP;
        }
        array[pivot].color = SortBarColor.PIVOT;
        if (i < j) {
          await this.swap(array, i, j);
        }
      }
      await this.swap(array, pivot, j);
      array[i].color = SortBarColor.NORMAL;
      array[j].color = SortBarColor.NORMAL;
      array[pivot].color = SortBarColor.NORMAL;
      await this.quickSort(array, left, j - 1);
      await this.quickSort(array, j + 1, right);
    }
  }

  public async mergeSort(array: SortBarComponent[], start: number, end: number): Promise<void> {
    if (start >= end - 1) return;
    const mid: number = start + Math.trunc((end - start) / 2);
    await this.mergeSort(array, start, mid);
    await this.mergeSort(array, mid, end);
    const cloned: SortBarComponent[] = Array(end - start).fill(array[0]);
    let k: number = mid;

    for (let i = start, r = 0; i < mid; r++, i++) {
      if (!this.sorting) return;
      while (k < end && array[k].value < array[i].value) {
        this.noOfCompares++;
        cloned[r] = array[k];
        r++;
        k++;
      }
      cloned[r] = array[i];
    }

    for (let i = 0; i < k - start; i++) {
      if (!this.sorting) return;
      array[i + start] = cloned[i];
      array[i + start].color = SortBarColor.SWAP;
      this.noOfSwaps++;
      if (this.enableAudio) this._playBeep(3, array[i + start].value, 50);
      await this.sleep(this.sortDelay);
      array[i + start].color = SortBarColor.NORMAL;
    }
  }

  public async bubbleSort(array: SortBarComponent[]): Promise<void> {
    for (let i = 0; i < array.length; i++) {
      if (!this.sorting) return;
      for (let j = 0; j < (array.length - i - 1); j++) {
        if (!this.sorting) return;
        if (this.compare(array, j, j + 1)) {
          await this.swap(array, j, j + 1);
        }
      }
    }
  }
}
