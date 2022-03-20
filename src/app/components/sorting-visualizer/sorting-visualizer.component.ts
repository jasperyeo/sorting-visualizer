import { ChangeDetectorRef, Component, DoCheck, HostListener, Input, IterableDiffers, OnInit, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { SortBarStyle, SortBarComponent } from './../../shared/models/sort-bar/sort-bar.component';
import { SortingVisualizerService } from './sorting-visualizer.service';

import * as algorithms from './../../algorithms/index';
import { complexityTime, complexitySpace } from './../../shared/models/complexity-time-space';
import { StopwatchComponent } from './stopwatch/stopwatch.component';

@Component({
  selector: 'sorting-visualizer',
  templateUrl: './sorting-visualizer.component.html',
  styleUrls: ['./sorting-visualizer.component.scss']
})
export class SortingVisualizerComponent implements OnInit, DoCheck {

  @Input('langs') public langs: any[] = [];
  @Input('isMobileSafari') public isMobileSafari: boolean = false;
  public readonly complexityTime = complexityTime;
  public readonly complexitySpace = complexitySpace;
  public readonly audioContext: AudioContext = new AudioContext();
  public stopwatch: StopwatchComponent = new StopwatchComponent();
  public readonly audioGain: number = 6;
  public readonly audioMs: number = 50;
  public sortArray: SortBarComponent[] = [];
  public listedAlgorithms: any[] = [];
  public filteredAlgorithms: any[] = [];
  public sortAlgorithms: any[] = [];
  public gaps: number[] = [];
  public sortInfoPaginator: boolean[] = [true, false, false];
  public iterableDiffer: any;
  public lang: string = 'en';
  public selectedAlgorithm: any;
  public sortDelay: number = 50;
  public sortMethod: string = '';
  public sortDescription: string = '';
  public sortLink: string = '';
  public sortStyle: string = SortBarStyle.BAR;
  public randomMethod: string = 'RANDOM';
  public selectAlgorithmSearchTerm: string = '';
  public visualTime: string = '';
  public sortAttempts: number = 0;
  public elementCount: number = 400;
  public uniqueCount: number = 400;
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
  public enableAudio: boolean = true;
  public showValues: boolean = false;
  public loading: boolean = false;
  public showIntro: boolean = true;
  public showComparison: boolean = false;
  public dropdownOpened: boolean = false;

  public readonly sortStyles: any[] = [
    {
      category: 'BASIC',
      styles: [
        SortBarStyle.BAR,
        SortBarStyle.POINT,
        SortBarStyle.LINE
      ]
    },
    {
      category: 'FANCY',
      styles: [
        SortBarStyle.BALLOON,
        SortBarStyle.BAMBOO
      ]
    }
  ];

  public readonly randomMethods: string[] = [
    'RANDOM',
    'ASCENDING',
    'DESCENDING',
    'ASCENDING_ALMOST',
    'DESCENDING_ALMOST'
  ];

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _sortingVisualizerService: SortingVisualizerService,
    private _translateService: TranslateService,
    private _iterableDiffers: IterableDiffers
  ) {
    this.iterableDiffer = this._iterableDiffers.find([]).create(undefined);
  }

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

  public ngDoCheck(): void {
    if (this.sortStyle !== SortBarStyle.LINE) return;
    const changes = this.iterableDiffer.diff(this.sortArray);
    if (changes) {
      let polyline: HTMLElement = document.getElementById('polyline') as HTMLElement;
      if (polyline) {
        let coord: string = '';
        let xOffset: number = 6;
        this.sortArray.forEach(point => {
          coord = coord.concat(xOffset.toString(), ',', (point.value - 5).toString(), ' ');
          xOffset += 12;
        });
        polyline.setAttribute('points', coord);
      }
    }
  }

  public openAlgoDropdown(): void {
    if (this.sorting) return;
    let dropdownElement: HTMLSelectElement = document.getElementById('select-algorithm-dropdown') as HTMLSelectElement;
    if (!dropdownElement) return;
    dropdownElement.setAttribute('size', '12');
    dropdownElement.style.position = 'fixed';
    dropdownElement.style.top = '4rem';
    dropdownElement.style.height = 'auto';
    dropdownElement.style.zIndex = '3';
    dropdownElement.style.borderRadius = '0px';
    this.dropdownOpened = true;
  }

  @HostListener('document:click', ['$event'])
  public closeAlgoDropdown(event: any): void {
    if ((event.target.className && typeof event.target.className.includes !== 'undefined' && (event.target.className as string).includes('sort__header--dropdown-search')) || (!this.selectedAlgorithm && this.selectAlgorithmSearchTerm.length)) {
      return;
    }
    let dropdownElement: HTMLSelectElement = document.getElementById('select-algorithm-dropdown') as HTMLSelectElement;
    if (!dropdownElement) return;
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

  // @HostListener('window:resize')
  // public windowChange(): void {
  //   this.loading = true;
  //   setTimeout(() => {
  //     window.location.reload();
  //   }, 500);
  // }

  private _scrapAlgorithmInformation(): void {
    this.sortAlgorithms.forEach(category => {
      category.count = category.algorithms.length;
      category.algorithms.forEach((algo: any) => {
        algo.category = category.category;
        let sortString: string[] = (algo.value as string).split(' ');
        if (category.category !== 'System') {
          this._sortingVisualizerService.getWikipediaSummary(sortString.pop() + '_sort').then((res: any) => {
            if (res) {
              algo.description = res.extract;
              if (res.content_urls && res.content_urls.desktop) {
                algo.link = res.content_urls.desktop.page;
              }
            }
          });
        }
      });
    });
  }
 
  public playBeep(hertz: number): void {
    const oscillator: OscillatorNode = this.audioContext.createOscillator();
    const createdGain: GainNode = this.audioContext.createGain();
    oscillator.connect(createdGain);
    oscillator.frequency.value = hertz;
    oscillator.type = "triangle"; // "sine" < "triangle" < "square" < "sawtooth"
    createdGain.connect(this.audioContext.destination);
    createdGain.gain.value = this.audioGain * 0.02;
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + this.audioMs * 0.001);
  }

  public async resetArray(): Promise<void> {
    this.stopwatch.reset();
    if (this.enableAudio) this.playBeep(10);
    this.sortAttempts = 0;
    this.noOfCompares = 0;
    this.noOfSwaps = 0;
    this.gaps.splice(0);
    this.sortArray.splice(0);
    this.sorting = true;
    let tempArray: number[] = [];
    for (let i: number = 0; i < this.elementCount; i++) {
      tempArray.push(this._randomNumberFromRange(this.minValue, this.maxValue));
    }
    switch (this.randomMethod) {
      case 'ASCENDING': tempArray.sort((a: number, b: number): number => { return a - b }); break;
      case 'DESCENDING': tempArray.sort((a: number, b: number): number => { return b - a }); break;
      case 'ASCENDING_ALMOST':
        { 
          tempArray.sort((a: number, b: number): number => { return a - b });
          const interval: number = Math.floor(tempArray.length / 5);
          for (let i: number = tempArray.length - 1; i > 0; i -= interval) {
            const j = Math.floor(Math.random() * (i + 1));
            [tempArray[i], tempArray[j]] = [tempArray[j], tempArray[i]];
          }
        }
        break;
      case 'DESCENDING_ALMOST':
        {
          tempArray.sort((a: number, b: number): number => { return b - a });
          const interval: number = Math.floor(tempArray.length / 5);
          for (let i: number = tempArray.length - 1; i > 0; i -= interval) {
            const j = Math.floor(Math.random() * (i + 1));
            [tempArray[i], tempArray[j]] = [tempArray[j], tempArray[i]];
          }
        }
        break;
    }
    for (let i: number = 0; i < this.elementCount; i++) {
      let sortBar: SortBarComponent = new SortBarComponent;
      sortBar.id = 'bar' + i.toString();
      sortBar.style = this.sortStyle;
      sortBar.sortDelay = this.sortDelay;
      sortBar.value = tempArray[i];
      sortBar.valueString = sortBar.value.toString();
      const hueValue: string = ((sortBar.value / this.maxValue) * 360).toString();
      sortBar.defaultColor = 'hsl(' + hueValue + ', 100%, 77%)';
      if (this.enableAudio) this.playBeep(sortBar.value);
      sortBar.showValue = this.showValues;
      this.sortArray.push(sortBar);
      this.uniqueCount = [...new Set(this.sortArray.map(bar => bar.value))].length;
      await this.sleep(0);
    }
    this.sorting = false;
  }

  private _randomNumberFromRange(min: number, max: number) {
    return Math.floor(Math.random() * (max  - min + 1) + min);
  }

  public stop(): void {
    this.stopwatch.stop();
    this.sorting = false;
    this.resetArray();
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

  public resetSearchTerm(): void {
    this.selectAlgorithmSearchTerm = '';
    this.sortMethod = '';
    this.sortDescription = '';
    this.sortLink = '';
    this.selectedAlgorithm = null;
    this.search();
    this.resetArray();
  }

  private _camelize(str: string): string {
    return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
  }

  public sort(array: SortBarComponent[], mode: string): void {
    this.sortAttempts++;
    this.sorting = true;
    const fnName: string = this._camelize(mode) + 'Sort';
    this.stopwatch.start();
    if (fnName !== 'javascriptSort') {
      (algorithms.algorithms.get(fnName) as Function)(this, array).then(() => {
        this.stopwatch.stop();
        this.sorting = false;
      });
    } else {
      array.sort((a: SortBarComponent, b: SortBarComponent) => {
        this.noOfCompares++;
        return a.value - b.value;
      });
      this.stopwatch.stop();
      this.sorting = false;
    }
  }

  public jumpToSortInfoPage(index: number): void {
    this.sortInfoPaginator = [false, false, false];
    this.sortInfoPaginator[index] = true;
    let element: HTMLElement | null = null;
    switch (index) {
      case 0: element = document.getElementById('settings'); break;
      case 1: element = document.getElementById('statistics'); break;
      case 2: element = document.getElementById('information'); break;
    }
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  @HostListener('touchend')
  public onSwipeSortInfoPage(): void {
    setTimeout(() => {
      if (this.isElementInViewport(document.getElementById('settings'))) {
        this.sortInfoPaginator = [false, false, false];
        this.sortInfoPaginator[0] = true;
      } else if (this.isElementInViewport(document.getElementById('statistics'))) {
        this.sortInfoPaginator = [false, false, false];
        this.sortInfoPaginator[1] = true;
      } else if (this.isElementInViewport(document.getElementById('information'))) {
        this.sortInfoPaginator = [false, false, false];
        this.sortInfoPaginator[2] = true;
      }
    }, 1000);
  }

  public isElementInViewport(element: HTMLElement | null) : boolean {
    if (element === null) {
      return false;
    }
    const rect: DOMRect = element.getBoundingClientRect();
    const windowHeight: number = (window.innerHeight || document.documentElement.clientHeight);
    const windowWidth: number = (window.innerWidth || document.documentElement.clientWidth);
    return (
        (rect.left >= 0)
      && (rect.top >= 0)
      && ((rect.left + rect.width) <= windowWidth)
      && ((rect.top + rect.height) <= windowHeight)
    );
  }
}
