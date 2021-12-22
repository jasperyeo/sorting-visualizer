import { AfterViewInit, Component, HostListener, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { SortBarStyle, SortBarComponent } from './../../shared/models/sort-bar/sort-bar.component';
import { SortingVisualizerService } from './sorting-visualizer.service';

import * as algorithms from './../../algorithms/index';
import { complexityTime, complexitySpace } from './../../shared/models/complexity-time-space';

@Component({
  selector: 'sorting-visualizer',
  templateUrl: './sorting-visualizer.component.html',
  styleUrls: ['./sorting-visualizer.component.scss']
})
export class SortingVisualizerComponent implements OnInit, AfterViewInit {

  @Input('langs') public langs: any[] = [];
  @Input('isMobileSafari') public isMobileSafari: boolean = false;
  public readonly complexityTime = complexityTime;
  public readonly complexitySpace = complexitySpace;
  public readonly audioContext: AudioContext = new AudioContext();
  public sortArray: SortBarComponent[] = [];
  public listedAlgorithms: any[] = [];
  public filteredAlgorithms: any[] = [];
  public lang: string = 'en';
  public selectedAlgorithm: any;
  public sortDelay: number = 50;
  public sortMethod: string = '';
  public sortDescription: string = '';
  public sortLink: string = '';
  public sortStyle: string = SortBarStyle.BAR;
  public selectAlgorithmSearchTerm: string = '';
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
  public loading: boolean = false;
  public showIntro: boolean = false;
  public showComparison: boolean = false;
  public dropdownOpened: boolean = false;

  public readonly sortStyles: string[] = [
    SortBarStyle.BAR,
    SortBarStyle.POINT,
    SortBarStyle.BALLOON,
    SortBarStyle.BAMBOO
  ];
  
  public sortAlgorithms: any[] = [];

  constructor(private _sortingVisualizerService: SortingVisualizerService, private _translateService: TranslateService) { }

  public sleep(delay: number): Promise<void> {
    return new Promise(resolve => {
        setTimeout(resolve, delay);
    });
  }

  public ngOnInit(): void {
    this._sortingVisualizerService.getJSON('./assets/algorithms.json').then((res: any) => {
      this.sortAlgorithms = res;
      this._scrapAlgorithmInformation();

      if (this.sortAlgorithms && this.sortAlgorithms.length) {
        this.sortAlgorithms.forEach((cat: any) => {
          if (cat.algorithms && cat.algorithms.length) {
            cat.algorithms.forEach((algo: any) => {
              this.listedAlgorithms.push(algo);
            });
          }
        });
      }
      this.filteredAlgorithms = this.listedAlgorithms;
    });
    if (localStorage.getItem('lang')) {
      this.lang = localStorage.getItem('lang') as string;
      this.selectLang(this.lang);
    }
    this.viewWidth = window.innerWidth;
    this.viewHeight = window.innerHeight;
    this.elementCount = Math.floor(this.viewWidth / 14);
    this.maxValue = Math.floor(this.viewHeight * 0.45);
    this.resetArray();
  }

  public ngAfterViewInit(): void {
    
  }

  public openDropdown(event: FocusEvent): void {
    let dropdownElement: HTMLSelectElement = document.getElementById('select-algorithm-dropdown') as HTMLSelectElement;
    const left: number = dropdownElement.offsetLeft;
    dropdownElement.setAttribute('size', '12');
    dropdownElement.style.position = 'fixed';
    dropdownElement.style.top = '4rem';
    dropdownElement.style.height = 'auto';
    dropdownElement.style.zIndex = '3';
    dropdownElement.style.borderRadius = '0px';
    this.dropdownOpened = true;
  }

  @HostListener('document:click', ['$event'])
  public closeDropdown(event: any): void {
    if ((event.target.className as string).includes('sort__header--dropdown-search') || (!this.selectedAlgorithm && this.selectAlgorithmSearchTerm.length)) {
      return;
    }
    let dropdownElement: HTMLSelectElement = document.getElementById('select-algorithm-dropdown') as HTMLSelectElement;
    dropdownElement.setAttribute('size', '1');
    dropdownElement.style.position = '';
    dropdownElement.style.left ='';
    dropdownElement.style.top = '';
    dropdownElement.style.height = '';
    dropdownElement.style.zIndex = '';
    dropdownElement.style.borderRadius = '.8rem';
    this.dropdownOpened = false;
    if (this.selectedAlgorithm) {
      this.selectAlgorithmSearchTerm = this.selectedAlgorithm.label;
    }
  }

  public search(): void {
    if (!this.selectAlgorithmSearchTerm || !this.selectAlgorithmSearchTerm.length) {
      this.filteredAlgorithms = this.listedAlgorithms;
      return;
    }
    this.filteredAlgorithms = this.listedAlgorithms.filter(algo => (algo.label as string).toUpperCase().includes(this.selectAlgorithmSearchTerm.toUpperCase()) || (algo.category as string).toUpperCase().includes(this.selectAlgorithmSearchTerm.toUpperCase()));
  }

  @HostListener('window:resize')
  public windowChange(): void {
    this.loading = true;
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }

  private _scrapAlgorithmInformation(): void {
    this.sortAlgorithms.forEach(category => {
      category.count = category.algorithms.length;
      category.algorithms.forEach((algo: any) => {
        algo.category = category.category;
        let sortString: string[] = (algo.value as string).split(' ');
        this._sortingVisualizerService.getWikipediaSummary(sortString.pop() + '_sort').then((res: any) => {
          if (res) {
            algo.description = res.extract;
            if (res.content_urls && res.content_urls.desktop) {
              algo.link = res.content_urls.desktop.page;
            }
          }
        });
      });
    });
  }
 
  public playBeep(gain: number, hertz: number, ms: number): void {
    const oscillator: OscillatorNode = this.audioContext.createOscillator();
    const createdGain: GainNode = this.audioContext.createGain();
    oscillator.connect(createdGain);
    oscillator.frequency.value = hertz;
    oscillator.type = "sine";
    createdGain.connect(this.audioContext.destination);
    createdGain.gain.value = gain * 0.01;
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + ms * 0.001);
  }

  public async resetArray(): Promise<void> {
    if (this.enableAudio) this.playBeep(3, 10, 200);
    this.sortAttempts = 0;
    this.noOfCompares = 0;
    this.noOfSwaps = 0;
    this.sortArray.splice(0);
    this.sorting = true;
    for (let i: number = 0; i < this.elementCount; i++) {
      let sortBar: SortBarComponent = new SortBarComponent;
      sortBar.id = 'bar' + i.toString();
      sortBar.style = this.sortStyle;
      sortBar.sortDelay = this.sortDelay;
      sortBar.value = this._randomNumberFromRange(this.minValue, this.maxValue);
      sortBar.valueString = sortBar.value.toString();
      if (this.enableAudio) this.playBeep(3, sortBar.value, 50);
      sortBar.showValue = this.showValues;
      this.sortArray.push(sortBar);
      await this.sleep(0);
    }
    this.sorting = false;
  }

  private _randomNumberFromRange(min: number, max: number) {
    return Math.floor(Math.random() * (max  - min + 1) + min);
  }

  public stop(): void {
    this.sorting = false;
  }

  public selectLang(lang: string): void {
    this.loading = true;
    localStorage.setItem('lang', lang);
    this._translateService.use(lang).toPromise().then(res => this.loading = false);
  }

  public selectAlgorithm(mode: string): void {
    this.sortAlgorithms.forEach(category => {
      category.algorithms.forEach((algo: any) => {
        if (algo.value === mode) {
          this.sortDescription = algo.description;
          this.sortLink = algo.link;
          this.selectedAlgorithm = algo;
          if (mode.toUpperCase() === 'BITONIC') {
            this.elementCount = Math.floor(this.viewWidth / 14);
            let maxCount: number = 0;
            let pow: number = 1;
            while (maxCount < this.elementCount) {
              const newCount: number = Math.pow(2, pow);
              if (newCount <= this.elementCount) {
                maxCount = newCount;
                pow++;
              } else {
                break;
              }
            }
            this.elementCount = maxCount;
            this.resetArray();
          } else {
            this.elementCount = Math.floor(this.viewWidth / 14);
            this.resetArray();
          }
        }
      });
    });
  }

  public sort(array: SortBarComponent[], mode: string): void {
    this.sortAttempts++;
    this.sorting = true;
    switch (mode.toUpperCase()) {
      case 'QUICK':
        algorithms.quickSort(this, array, 0, array.length - 1).then(() => this.sorting = false);
        break;
      case 'MERGE':
        algorithms.mergeSort(this, array, 0, array.length).then(() => this.sorting = false);
        break;
      case 'SELECTION':
        algorithms.selectionSort(this, array).then(() => this.sorting = false);
        break;
      case 'HEAP':
        algorithms.heapSort(this, array).then(() => this.sorting = false);
        break;
      case 'INSERTION':
        algorithms.insertionSort(this, array).then(() => this.sorting = false);
        break;
      case 'SHELL':
        algorithms.shellSort(this, array).then(() => this.sorting = false);
        break;
      case 'TREE':
        algorithms.treeSort(this, array).then(() => this.sorting = false);
        break;
      case 'BUBBLE':
        algorithms.bubbleSort(this, array).then(() => this.sorting = false);
        break;
      case 'GNOME':
        algorithms.gnomeSort(this, array).then(() => this.sorting = false);
        break;
      case 'COCKTAIL SHAKER':
        algorithms.cocktailShakerSort(this, array).then(() => this.sorting = false);
        break;
      case 'EXCHANGE':
        algorithms.exchangeSort(this, array).then(() => this.sorting = false);
        break;
      case 'ODD-EVEN':
        algorithms.oddEvenSort(this, array).then(() => this.sorting = false);
        break;
      case 'COMB':
        algorithms.combSort(this, array).then(() => this.sorting = false);
        break;
      case 'LSD RADIX':
        algorithms.lsdRadixSort(this, array).then(() => this.sorting = false);
        break;
      case 'MSD RADIX':
        algorithms.msdRadixSort(this, array, this.maxValue).then(() => this.sorting = false);
        break;
      case 'PANCAKE':
        algorithms.pancakeSort(this, array).then(() => this.sorting = false);
        break;
      case 'BITONIC':
        algorithms.bitonicSort(this, array).then(() => this.sorting = false);
        break;
      case 'BOGO':
        algorithms.bogoSort(this, array).then(() => this.sorting = false);
        break;
    }
  }
}
