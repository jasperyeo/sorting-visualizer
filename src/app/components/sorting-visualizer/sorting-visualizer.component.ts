import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, HostListener, InputSignal, IterableDiffers, ModelSignal, OnInit, Signal, WritableSignal, computed, inject, input, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { SortBarComponent } from './../../shared/models/sort-bar/sort-bar.component';
import { SortingVisualizerService } from './sorting-visualizer.service';
import { ALGORITHMS, ALGORITHMS_INFO } from './../../algorithms/index';
import { COMPLEXITY_TIME, COMPLEXITY_SPACE } from '../../shared/models/complexity-time-space.constants';
import { StopwatchComponent } from './stopwatch/stopwatch.component';
import { IntroDialogComponent } from './intro-dialog/intro-dialog.component';
import { ComparisonDialogComponent } from './comparison-dialog/comparison-dialog.component';
import { BigONotationPipe } from '../../shared/pipes/big-o-notation.pipe';
import { SORT_BAR_DEFAULTS, SORT_STYLES, SortBarColor, SortBarInterface, SortBarStyle } from '../../shared/models/sort-bar/sort-bar.constants';
import { RANDOM_METHODS, VISUALIZER_DEFAULTS } from './sorting-visualizer.constants';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  private readonly _changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);
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
  protected readonly sortArray: WritableSignal<SortBarInterface[]> = signal<SortBarInterface[]>([]);
  protected readonly listedAlgorithms: WritableSignal<any[]> = signal<any[]>([]);
  protected readonly filteredAlgorithms: WritableSignal<any[]> = signal<any[]>([]);
  protected readonly sortAlgorithms: WritableSignal<any[]> = signal<any[]>([]);
  protected readonly gaps: WritableSignal<number[]> = signal<number[]>([]);
  protected readonly sortInfoPaginator: WritableSignal<boolean[]> = signal<boolean[]>([true, false, false]);
  protected readonly iterableDiffer: WritableSignal<any> = signal<any>(undefined);
  protected readonly lang: WritableSignal<string> = signal<string>(VISUALIZER_DEFAULTS.LANG);
  protected readonly selectedAlgorithm: WritableSignal<any> = signal<any>(undefined);
  protected readonly sortDelay: WritableSignal<number> = signal<number>(VISUALIZER_DEFAULTS.SORT_DELAY);
  protected readonly sortMethod: WritableSignal<string> = signal<string>('');
  protected readonly sortDescription: WritableSignal<string> = signal<string>('');
  protected readonly sortLink: WritableSignal<string> = signal<string>('');
  public readonly sortStats: WritableSignal<any[]> = signal<any[]>([]);
  public readonly sortStyle: WritableSignal<string> = signal<string>(VISUALIZER_DEFAULTS.SORT_STYLE);
  protected readonly randomMethod: WritableSignal<string> = signal<string>(VISUALIZER_DEFAULTS.RANDOM_METHOD);
  protected readonly selectAlgorithmSearchTerm: ModelSignal<string> = model<string>('');
  protected readonly visualTime: WritableSignal<string> = signal<string>('');
  protected readonly sortAttempts: WritableSignal<number> = signal<number>(0);
  protected readonly elementCount: WritableSignal<number> = signal<number>(VISUALIZER_DEFAULTS.ELEMENT_COUNT);
  protected readonly uniqueCount: WritableSignal<number> = signal<number>(VISUALIZER_DEFAULTS.UNIQUE_COUNT);
  public readonly minValue: WritableSignal<number> = signal<number>(VISUALIZER_DEFAULTS.MIN_VALUE);
  public readonly maxValue: WritableSignal<number> = signal<number>(VISUALIZER_DEFAULTS.MAX_VALUE);
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
  protected readonly polylineCoords: WritableSignal<any> = signal<any>(null);
  protected readonly swaplineCoords: WritableSignal<any> = signal<any>(null);
  protected readonly lineCompute = computed(() => {
    this.sortArray();
  });

  constructor() {
    this.iterableDiffer.update(() => this._iterableDiffers.find([]).create(undefined));
  }

  public sleep(delay: number = this.sortDelay()): Promise<void> {
    return new Promise(resolve => {
      setTimeout(resolve, delay);
    });
  }

  public ngOnInit(): void {
    this.sortAlgorithms.update(() => ALGORITHMS_INFO);
    this._scrapAlgorithmInformation();
    if (this.sortAlgorithms() && this.sortAlgorithms().length) {
      this.sortAlgorithms.update((sortAlgorithms) => {
        sortAlgorithms.forEach((cat: any) => {
          if (cat.algorithms && cat.algorithms.length) {
            cat.algorithms.forEach((algo: any) => {
              this.listedAlgorithms.update((listedAlgorithms) => {
                listedAlgorithms.push(algo);
                return listedAlgorithms;
              });
            });
          }
        });
        return sortAlgorithms;
      });
    }
    this.filteredAlgorithms.update(() => this.listedAlgorithms());
    if (localStorage.getItem('lang')) {
      this.lang.update(() => localStorage.getItem('lang') as string);
      this.selectLang(this.lang());
    }
    this.viewWidth.update(() => window.innerWidth);
    this.viewHeight.update(() => window.innerHeight);
    this.elementCount.update(() => Math.floor(this.viewWidth() / VISUALIZER_DEFAULTS.MAX_ELEMENT_COUNT_DIVISOR));
    this.maxValue.update(() => Math.floor(this.viewHeight() * VISUALIZER_DEFAULTS.MAX_VALUE_OFFSET_MULTIPLIER));
    this.resetArray();
  }

  public ngDoCheck(): void {
    const changes = this.iterableDiffer().diff(this.sortArray());
    if (changes) {
      if (this.sortStyle() === SortBarStyle.LINE) {
        let coord: string = '';
        let xOffset: number = VISUALIZER_DEFAULTS.SWAPLINE_OFFSET_X / 2;
        this.sortArray().forEach(point => {
          coord = coord.concat(xOffset.toString(), ',', (point.value - 5).toString(), ' ');
          xOffset += VISUALIZER_DEFAULTS.SWAPLINE_OFFSET_X;
        });
        this.polylineCoords.set(coord);
      }
      if (this.sorting() && this.showSwapCurve() && this.sortArray().length === this.elementCount()) {
        let coord: string = '', x1: number = -1, y1: number = -1, x2: number = -1, y2: number = -1;
        let swapCoords: any[] = [];
        this.sortArray().forEach((point: SortBarInterface, index: number) => {
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
        this.swaplineCoords.set(coord);
      }
      this._changeDetectorRef.markForCheck();
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
      (event.target.className as string).includes('sort__header--dropdown-search')) || (!this.selectedAlgorithm() && this.selectAlgorithmSearchTerm().length)) {
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
    if (this.selectedAlgorithm()) {
      this.selectAlgorithmSearchTerm.update(() => this.selectedAlgorithm().label);
    }
  }

  public search(): void {
    if (!this.selectAlgorithmSearchTerm() || !this.selectAlgorithmSearchTerm().length) {
      this.filteredAlgorithms.update(() => this.listedAlgorithms());
      return;
    }
    this.filteredAlgorithms.update(() => this.listedAlgorithms().filter(algo =>
      (algo.label as string).toUpperCase().includes(this.selectAlgorithmSearchTerm().toUpperCase()) ||
      (algo.category as string).toUpperCase().includes(this.selectAlgorithmSearchTerm().toUpperCase())));
  }

  private _scrapAlgorithmInformation(): void {
    this.sortAlgorithms.update((sortAlgorithms) => {
      sortAlgorithms.forEach(category => {
        category.count = category.algorithms.length;
        category.algorithms.forEach((algo: any) => {
          algo.category = category.category;
        });
      });
      return sortAlgorithms;
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
    this.gaps.update((gaps) => gaps = []);
    this.sortArray.update((sortArray) => sortArray = []);
    this.sorting.update(() => true);
    let tempArray: number[] = [];
    for (let i: number = 0; i < this.elementCount(); i++) {
      tempArray.push(this._randomNumberFromRange(this.minValue(), this.maxValue()));
    }
    switch (this.randomMethod()) {
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
    for (let i: number = 0; i < this.elementCount(); i++) {
      let defaultColor: string = SORT_BAR_DEFAULTS.DEFAULT_COLOR;
      if (this.showGradientColor()) {
        const hueValue: string = ((tempArray[i] / this.maxValue()) * 360).toString();
        defaultColor = 'hsl(' + hueValue + ', 100%, 77%)';
      }
      let sortBar: SortBarInterface = {
        id: 'bar' + i.toString(), // id
        defaultColor: defaultColor, // defaultColor
        color: SortBarColor.NORMAL, // color
        style: this.sortStyle(), // style
        sortDelay: this.sortDelay(), // sortDelay
        value: tempArray[i], // value
        valueString: tempArray[i].toString(), // valueString
        showValue: this.showValues(), // showValue
        showGradientColor: this.showGradientColor() // showGradientColor
      };
      this.sortArray.update((sortArray) => {
        sortArray.push(sortBar);
        return sortArray;
      });
      this.uniqueCount.update(() => [...new Set(this.sortArray().map(bar => bar.value))].length);
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
    this.selectAlgorithm(this.sortMethod());
    this._translateService.use(lang).subscribe(res => this.loading.update(() => false));
  }

  public selectAlgorithm(mode: string): void {
    this.sortAlgorithms.update((sortAlgorithms) => {
      sortAlgorithms.forEach(category => {
        category.algorithms.forEach((algo: any) => {
          if (algo.value === mode) {
            this._sortingVisualizerService.getWikipediaSummary(algo.labels[this.lang()] ? this.lang() : 'en', algo.labels[this.lang()] ?? algo.labels['en'])
              .subscribe(async (res: any) => {
                if (res) {
                  algo.description = res.extract;
                  this.sortDescription.update(() => algo.description);
                  if (res.content_urls && res.content_urls.desktop) {
                    algo.link = res.content_urls.desktop.page;
                    this.sortLink.update(() => algo.link);
                  }
                }
              });
            this.selectedAlgorithm.update(() => algo);
            if (algo.stats) {
              algo.stats.forEach((stat: any) => {
                if (stat.type === 'array') stat.value = [];
                else if (stat.type === 'string') stat.value = '0';
              });
            }
            this.sortStats.update(() => algo.stats);
            if (mode.toUpperCase() === 'BITONIC') {
              this.elementCount.update(() => Math.floor(this.viewWidth() / VISUALIZER_DEFAULTS.MAX_ELEMENT_COUNT_DIVISOR));
              let maxCount: number = 0;
              let pow: number = 1;
              while (maxCount < this.elementCount()) {
                const newCount: number = Math.pow(2, pow);
                if (newCount <= this.elementCount()) {
                  maxCount = newCount;
                  pow++;
                } else {
                  break;
                }
              }
              this.elementCount.update(() => maxCount);
              this.resetArray();
            } else {
              this.elementCount.update(() => Math.floor(this.viewWidth() / VISUALIZER_DEFAULTS.MAX_ELEMENT_COUNT_DIVISOR));
              this.resetArray();
            }
          }
        });
      });
      return sortAlgorithms;
    });
  }

  public resetSearchTerm(): void {
    this.selectAlgorithmSearchTerm.update(() => '');
    this.sortMethod.update(() => '');
    this.sortDescription.update(() => '');
    this.sortLink.update(() => '');
    this.selectedAlgorithm.update(() => null);
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
      (ALGORITHMS.get(fnName) as Function)(this, array).then(() => {
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
    this.sortInfoPaginator.update(() => [false, false, false]);
    this.sortInfoPaginator()[index] = true;
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
        if (this.sortInfoPaginator()[0] === true) {
          this.sortInfoPaginator.update(() => [false, true, false]);
        } else if (this.sortInfoPaginator()[1] === true) {
          this.sortInfoPaginator.update(() => [false, false, true]);
        }
      } else if (this._touchStart() < touchEnd - swipeThreshold) {
        // slide left
        if (this.sortInfoPaginator()[1] === true) {
          this.sortInfoPaginator.update(() => [true, false, false]);
        } else if (this.sortInfoPaginator()[2] === true) {
          this.sortInfoPaginator.update(() => [false, true, false]);
        }
      }
    }
  }
}
