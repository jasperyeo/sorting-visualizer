import { Component, HostListener, OnInit } from '@angular/core';

import { SortBarColor, SortBarComponent } from './../../shared/models/sort-bar/sort-bar.component';
import { SortingVisualizerService } from './sorting-visualizer.service';

import * as algorithms from './../../algorithms/index';

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
 
  public playBeep(gain: number, hertz: number, ms: number): void {
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
    if (this.enableAudio) this.playBeep(3, 10, 200);
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
        algorithms.quickSort(this, array, 0, array.length - 1).then(() => this.sorting = false);
        break;
      case 'merge':
        algorithms.mergeSort(this, array, 0, array.length).then(() => this.sorting = false);
        break;
      case 'bubble':
        algorithms.bubbleSort(this, array).then(() => this.sorting = false);
        break;
    }
  }
}
