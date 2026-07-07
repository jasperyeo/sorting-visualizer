import { ChangeDetectionStrategy, Component, DoCheck, HostListener, InputSignal, IterableDiffers, OnInit, Signal, WritableSignal, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import translate from 'google-translate-api-x';
import { SortBarComponent } from './../../shared/models/sort-bar/sort-bar.component';
import { SortingVisualizerService } from './sorting-visualizer.service';
import * as algorithms from './../../algorithms/index';
import { COMPLEXITY_TIME, COMPLEXITY_SPACE } from '../../shared/models/complexity-time-space.constants';
import { StopwatchComponent } from './stopwatch/stopwatch.component';
import { IntroDialogComponent } from './intro-dialog/intro-dialog.component';
import { ComparisonDialogComponent } from './comparison-dialog/comparison-dialog.component';
import { BigONotationPipe } from '../../shared/pipes/big-o-notation.pipe';
import { SORT_BAR_DEFAULTS, SORT_STYLES, SortBarColor, SortBarInterface, SortBarStyle } from '../../shared/models/sort-bar/sort-bar.constants';
import { RANDOM_METHODS, VISUALIZER_DEFAULTS } from './sorting-visualizer.constants';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FormsModule,
    TranslatePipe,
    IntroDialogComponent,
    ComparisonDialogComponent,
    SortBarComponent,
    BigONotationPipe
  ],
  selector: 'sorting-visualizer',
  templateUrl: './sorting-visualizer.component.html',
  styleUrls: ['./sorting-visualizer.component.scss'],
  host: {
    '(touchstart)': 'onSwipeSortInfoPageStart($event)',
    '(touchend)': 'onSwipeSortInfoPageEnd($event)'
  }
})
export class SortingVisualizerComponent implements OnInit, DoCheck {

  private readonly _sortingVisualizerService: SortingVisualizerService = inject(SortingVisualizerService);
  private readonly _translateService: TranslateService = inject(TranslateService);
  private readonly _iterableDiffers: IterableDiffers = inject(IterableDiffers);
  public readonly langs: InputSignal<any[]> = input<any[]>([]);
  public readonly isMobileSafari: InputSignal<boolean> = input<boolean>(false);
  private readonly _stopwatch: StopwatchComponent = new StopwatchComponent();
  private readonly _audioContext: AudioContext = new AudioContext();
  protected readonly sortStyles = SORT_STYLES;
  protected readonly randomMethods: string[] = RANDOM_METHODS;
  protected readonly COMPLEXITY_TIME = COMPLEXITY_TIME;
  protected readonly COMPLEXITY_SPACE = COMPLEXITY_SPACE;
  private readonly AUDIO_GAIN: number = VISUALIZER_DEFAULTS.AUDIO_GAIN;
  private readonly AUDIO_MS: number = VISUALIZER_DEFAULTS.AUDIO_MS;
  public sortArray: SortBarInterface[] = [];
  public listedAlgorithms: any[] = [];
  public filteredAlgorithms: any[] = [];
  public sortAlgorithms: any[] = [];
  public gaps: number[] = [];
  public sortInfoPaginator: boolean[] = [true, false, false];
  public iterableDiffer: any;
  protected lang: string = VISUALIZER_DEFAULTS.LANG;
  public selectedAlgorithm: any;
  public sortDelay: number = VISUALIZER_DEFAULTS.SORT_DELAY;
  public sortMethod: string = '';
  public sortDescription: string = '';
  public sortLink: string = '';
  public sortStats: WritableSignal<any[]> = signal<any[]>([]);
  public sortStyle: string = VISUALIZER_DEFAULTS.SORT_STYLE;
  protected randomMethod: string = VISUALIZER_DEFAULTS.RANDOM_METHOD;
  protected readonly selectAlgorithmSearchTerm: WritableSignal<string> = signal<string>('');
  protected readonly visualTime: WritableSignal<string> = signal<string>('');
  protected readonly sortAttempts: WritableSignal<number> = signal<number>(0);
  protected elementCount: number = VISUALIZER_DEFAULTS.ELEMENT_COUNT;
  protected uniqueCount: number = VISUALIZER_DEFAULTS.UNIQUE_COUNT;
  protected minValue: number = VISUALIZER_DEFAULTS.MIN_VALUE;
  public maxValue: number = VISUALIZER_DEFAULTS.MAX_VALUE;
  public readonly noOfCompares: WritableSignal<number> = signal<number>(0);
  public readonly noOfSwaps: WritableSignal<number> = signal<number>(0);
  protected readonly viewWidth: WritableSignal<number> = signal<number>(0);
  protected readonly viewHeight: WritableSignal<number> = signal<number>(0);
  protected readonly sorting: WritableSignal<boolean> = signal<boolean>(false);
  public readonly isSorting: Signal<boolean> = this.sorting.asReadonly();
  protected readonly showControlPanel: WritableSignal<boolean> = signal<boolean>(true);
  protected readonly showSettings: WritableSignal<boolean> = signal<boolean>(true);
  protected readonly showStatistics: WritableSignal<boolean> = signal<boolean>(true);
  protected readonly showInfo: WritableSignal<boolean> = signal<boolean>(true);
  protected readonly showCredits: WritableSignal<boolean> = signal<boolean>(true);
  protected readonly showGradientColor: WritableSignal<boolean> = signal<boolean>(true);
  public readonly isGradientColorShowed: Signal<boolean> = this.showGradientColor.asReadonly();
  protected readonly enableAudio: WritableSignal<boolean> = signal<boolean>(true);
  public readonly isAudioEnabled: Signal<boolean> = this.enableAudio.asReadonly();
  protected readonly showValues: WritableSignal<boolean> = signal<boolean>(false);
  public readonly isValuesShowed: Signal<boolean> = this.showValues.asReadonly();
  protected readonly showSwapCurve: WritableSignal<boolean> = signal<boolean>(true);
  protected readonly loading: WritableSignal<boolean> = signal<boolean>(false);
  protected readonly showIntro: WritableSignal<boolean> = signal<boolean>(true);
  protected readonly showComparison: WritableSignal<boolean> = signal<boolean>(false);
  protected readonly dropdownOpened: WritableSignal<boolean> = signal<boolean>(false);
  private readonly _touchStart: WritableSignal<number> = signal<number>(0);

  constructor() {
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
    this.viewWidth.update(() => window.innerWidth);
    this.viewHeight.update(() => window.innerHeight);
    this.elementCount = Math.floor(this.viewWidth() / VISUALIZER_DEFAULTS.MAX_ELEMENT_COUNT_DIVISOR);
    this.maxValue = Math.floor(this.viewHeight() * VISUALIZER_DEFAULTS.MAX_VALUE_OFFSET_MULTIPLIER);
    this.resetArray();
  }

  public ngDoCheck(): void {
    const changes = this.iterableDiffer.diff(this.sortArray);
    if (changes) {
      if (this.sortStyle === SortBarStyle.LINE) {
        let polyline: HTMLElement = document.getElementById('polyline') as HTMLElement;
        if (polyline) {
          let coord: string = '';
          let xOffset: number = VISUALIZER_DEFAULTS.SWAPLINE_OFFSET_X / 2;
          this.sortArray.forEach(point => {
            coord = coord.concat(xOffset.toString(), ',', (point.value - 5).toString(), ' ');
            xOffset += VISUALIZER_DEFAULTS.SWAPLINE_OFFSET_X;
          });
          polyline.setAttribute('points', coord);
        }
      }
      if (this.sorting() && this.showSwapCurve() && this.sortArray.length === this.elementCount) {
        let swapline: HTMLElement = document.getElementById('swapline') as HTMLElement;
        if (swapline) {
          let coord: string = '', x1: number = -1, y1: number = -1, x2: number = -1, y2: number = -1;
          let swapCoords: any[] = [];
          this.sortArray.forEach((point: SortBarInterface, index: number) => {
            if (point.color === SortBarColor.SWAP) {
              if (x1 === -1 && x2 === -1) {
                x1 = VISUALIZER_DEFAULTS.SWAPLINE_OFFSET_X * (index + 1);
                y1 = point.value + VISUALIZER_DEFAULTS.SWAPLINE_OFFSET_Y;
                swapCoords.push({ x: x1, y: y1 });
                swapCoords.push({ x: -1, y: -1 });
              } else {
                x2 = VISUALIZER_DEFAULTS.SWAPLINE_OFFSET_X * (index + 1);
                y2 = point.value + VISUALIZER_DEFAULTS.SWAPLINE_OFFSET_Y;
                swapCoords.push({ x: x2, y: y2 });
              }
            }
          });
          swapCoords[1].x = (swapCoords[2].x - swapCoords[0].x) / 2 + swapCoords[0].x;
          swapCoords[1].y = (swapCoords[0].y > swapCoords[2].y) ?
            swapCoords[0].y + VISUALIZER_DEFAULTS.SWAPLINE_CURVE_PEAK :
            swapCoords[2].y + VISUALIZER_DEFAULTS.SWAPLINE_CURVE_PEAK;
          swapCoords.forEach((swapCoord: any, index: number) => {
            let finalX: string = swapCoord.x.toString();
            if (index === 0) {
              finalX = 'M' + finalX;
            } else if (index === 1) {
              finalX = 'Q' + finalX;
            }
            coord = coord.concat(finalX, ',', swapCoord.y.toString(), ' ');
          });
          swapline.setAttribute('d', coord);
        }
      }
    }
  }

  public openAlgoDropdown(): void {
    if (this.sorting()) return;
    let dropdownElement: HTMLSelectElement = document.getElementById('select-algorithm-dropdown') as HTMLSelectElement;
    if (!dropdownElement) return;
    dropdownElement.setAttribute('size', '12');
    dropdownElement.style.position = 'fixed';
    dropdownElement.style.top = '4rem';
    dropdownElement.style.height = 'auto';
    dropdownElement.style.zIndex = '3';
    dropdownElement.style.borderRadius = '0px';
    this.dropdownOpened.update(() => true);
  }

  @HostListener('document:click', ['$event'])
  public closeAlgoDropdown(event: any): void {
    if ((event.target.className && typeof event.target.className.includes !== 'undefined' &&
      (event.target.className as string).includes('sort__header--dropdown-search')) || (!this.selectedAlgorithm && this.selectAlgorithmSearchTerm.length)) {
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
    this.dropdownOpened.update(() => false);
    if (this.selectedAlgorithm) {
      this.selectAlgorithmSearchTerm.update(() => this.selectedAlgorithm.label);
    }
  }

  public search(): void {
    if (!this.selectAlgorithmSearchTerm || !this.selectAlgorithmSearchTerm.length) {
      this.filteredAlgorithms = this.listedAlgorithms;
      return;
    }
    this.filteredAlgorithms = this.listedAlgorithms.filter(algo =>
      (algo.label as string).toUpperCase().includes(this.selectAlgorithmSearchTerm().toUpperCase()) ||
      (algo.category as string).toUpperCase().includes(this.selectAlgorithmSearchTerm().toUpperCase()));
  }

  private _scrapAlgorithmInformation(): void {
    this.sortAlgorithms.forEach(category => {
      category.count = category.algorithms.length;
      category.algorithms.forEach((algo: any) => {
        algo.category = category.category;
        // let sortString: string[] = (algo.value as string).split(' ');
        // if (category.category !== 'System') {
        //   this._sortingVisualizerService.getWikipediaSummary(this.lang, sortString.pop() + '_sort').then((res: any) => {
        //     if (res) {
        //       algo.description = res.extract;
        //       if (res.content_urls && res.content_urls.desktop) {
        //         algo.link = res.content_urls.desktop.page;
        //       }
        //     }
        //   });
        // }
      });
    });
  }
 
  public playBeep(hertz: number): void {
    const oscillator: OscillatorNode = this._audioContext.createOscillator();
    const createdGain: GainNode = this._audioContext.createGain();
    oscillator.connect(createdGain);
    oscillator.frequency.value = hertz;
    oscillator.type = VISUALIZER_DEFAULTS.AUDIO_OSCILLATOR_TYPE;
    createdGain.connect(this._audioContext.destination);
    createdGain.gain.value = this.AUDIO_GAIN * VISUALIZER_DEFAULTS.AUDIO_GAIN_MULTIPLIER;
    oscillator.start(this._audioContext.currentTime);
    oscillator.stop(this._audioContext.currentTime + this.AUDIO_MS * VISUALIZER_DEFAULTS.AUDIO_OSCILLATOR_TIMEOUT);
  }

  public async resetArray(): Promise<void> {
    await this.sleep(0);
    this._stopwatch.reset();
    if (this.enableAudio()) this.playBeep(10);
    this.sortAttempts.update(() => 0);
    this.noOfCompares.update(() => 0);
    this.noOfSwaps.update(() => 0);
    this.gaps.splice(0);
    this.sortArray.splice(0);
    this.sorting.update(() => true);
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
      let defaultColor: string = SORT_BAR_DEFAULTS.DEFAULT_COLOR;
      if (this.showGradientColor()) {
        const hueValue: string = ((tempArray[i] / this.maxValue) * 360).toString();
        defaultColor = 'hsl(' + hueValue + ', 100%, 77%)';
      }
      let sortBar: SortBarInterface = {
        id: 'bar' + i.toString(), // id
        defaultColor: defaultColor, // defaultColor
        color: SortBarColor.NORMAL, // color
        style: this.sortStyle, // style
        sortDelay: this.sortDelay, // sortDelay
        value: tempArray[i], // value
        valueString: tempArray[i].toString(), // valueString
        showValue: this.showValues(), // showValue
        showGradientColor: this.showGradientColor() // showGradientColor
      };
      this.sortArray.push(sortBar);
      this.uniqueCount = [...new Set(this.sortArray.map(bar => bar.value))].length;
      await this.sleep(0);
    }
    this.sorting.update(() => false);
  }

  private _randomNumberFromRange(min: number, max: number) {
    return Math.floor(Math.random() * (max  - min + 1) + min);
  }

  public stop(): void {
    this._stopwatch.stop();
    this.sorting.update(() => false);
    this.resetArray();
  }

  public selectLang(lang: string): void {
    this.loading.update(() => true);
    localStorage.setItem('lang', lang);
    if (this.lang !== lang) {
      this.sortAlgorithms.forEach(category => {
        category.algorithms.forEach((algo: any) => {
          algo.description = undefined;
          algo.link = undefined;
        });
      });
    }
    this._translateService.use(lang).toPromise().then(res => this.loading.update(() => false));
  }

  public selectAlgorithm(mode: string): void {
    this.sortAlgorithms.forEach(category => {
      category.algorithms.forEach((algo: any) => {
        if (algo.value === mode) {
          if (!algo.description && !algo.link) {
            let sortString: string[] = (algo.value as string).split(' ');
            this._sortingVisualizerService.getWikipediaSummary(this.lang, sortString.pop() + '_sort').then((res: any) => {
              if (res) {
                algo.description = res.extract;
                this.sortDescription = algo.description;
                if (res.content_urls && res.content_urls.desktop) {
                  algo.link = res.content_urls.desktop.page;
                  this.sortLink = algo.link;
                }
              }
            });
          } else {
            this.sortDescription = algo.description;
            this.sortLink = algo.link;
          }
          this.selectedAlgorithm = algo;
          if (algo.stats) {
            algo.stats.forEach((stat: any) => {
              if (stat.type === 'array') stat.value = [];
              else if (stat.type === 'string') stat.value = '0';
            });
          }
          this.sortStats.update(() => algo.stats);
          if (mode.toUpperCase() === 'BITONIC') {
            this.elementCount = Math.floor(this.viewWidth() / VISUALIZER_DEFAULTS.MAX_ELEMENT_COUNT_DIVISOR);
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
            this.elementCount = Math.floor(this.viewWidth() / VISUALIZER_DEFAULTS.MAX_ELEMENT_COUNT_DIVISOR);
            this.resetArray();
          }
        }
      });
    });
  }

  public resetSearchTerm(): void {
    this.selectAlgorithmSearchTerm.update(() => '');
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

  public sort(array: SortBarInterface[], mode: string): void {
    if (this.sortStats()) {
      this.sortStats.update((stats) => {
        return stats.map((stat: any) => {
          if (stat.type === 'array') stat.value = [];
          else if (stat.type === 'string') stat.value = '0';
          return stat;
        });
      });
    }
    this.sortAttempts.update((value) => value + 1);
    this.sorting.update(() => true);
    const fnName: string = this._camelize(mode) + 'Sort';
    this._stopwatch.start();
    if (fnName !== 'javascriptSort') {
      (algorithms.algorithms.get(fnName) as Function)(this, array).then(() => {
        this._stopwatch.stop();
        this.sorting.update(() => false);
      });
    } else {
      array.sort((a: SortBarInterface, b: SortBarInterface) => {
        this.noOfCompares.update((value) => value + 1);
        return a.value - b.value;
      });
      this._stopwatch.stop();
      this.sorting.update(() => false);
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

  public onSwipeSortInfoPageStart(event: any): void {
    if (event && event.touches) {
      this._touchStart.update(() => event.touches[0].clientX);
    }
  }

  public onSwipeSortInfoPageEnd(event: any): void {
    const swipeThreshold: number = VISUALIZER_DEFAULTS.SWIPE_THRESHOLD;
    if (event && event.touches) {
      const touchEnd: number = event.changedTouches[0].clientX;
      if (this._touchStart() > touchEnd + swipeThreshold) {
        // slide right
        if (this.sortInfoPaginator[0] === true) {
          this.sortInfoPaginator = [false, true, false];
        } else if (this.sortInfoPaginator[1] === true) {
          this.sortInfoPaginator = [false, false, true];
        }
      } else if (this._touchStart() < touchEnd - swipeThreshold) {
        // slide left
        if (this.sortInfoPaginator[1] === true) {
          this.sortInfoPaginator = [true, false, false];
        } else if (this.sortInfoPaginator[2] === true) {
          this.sortInfoPaginator = [false, true, false];
        }
      }
    }
  }
}
