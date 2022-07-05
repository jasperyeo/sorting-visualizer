import { SortingVisualizerComponent } from '../components/sorting-visualizer/sorting-visualizer.component';
import { SortBarComponent } from './../shared/models/sort-bar/sort-bar.component';

export * from './common';

import { leftPivotQuickSort, middlePivotQuickSort, medianPivotQuickSort } from './quick-sort';
import { mergeSort } from './merge-sort';
import { timSort } from './tim-sort';
import { selectionSort, doubleSelectionSort } from './selection-sort';
import { heapSort } from './heap-sort';
import { cycleSort } from './cycle-sort';
import { insertionSort } from './insertion-sort';
import { shellSort, frankLazarusShellSort, hibbardShellSort, papernovStasevichShellSort, tokudaShellSort, ciuraShellSort } from './shell-sort';
import { treeSort } from './tree-sort';
import { bubbleSort } from './bubble-sort';
import { gnomeSort } from './gnome-sort';
import { cocktailShakerSort, boundedCocktailShakerSort } from './cocktail-shaker-sort';
import { exchangeSort } from './exchange-sort';
import { oddEvenSort } from './odd-even-sort';
import { combSort } from './comb-sort';
import { uniformKeysBucketSort } from './uniform-keys-bucket-sort';
import { integerKeysBucketSort } from './integer-keys-bucket-sort';
import { countingSort } from './counting-sort';
import { lsdRadixSort } from './lsd-radix-sort';
import { msdRadixSort } from './msd-radix-sort';
import { pancakeSort } from './pancake-sort';
import { bitonicSort } from './bitonic-sort';
import { stoogeSort } from './stooge-sort';
import { slowSort } from './slow-sort';
import { bogoSort } from './bogo-sort';

export const algorithms: Map<string, (visualizer: SortingVisualizerComponent, array: SortBarComponent[]) => Promise<void>> = new Map([
  ['leftPivotQuickSort', leftPivotQuickSort],
  ['middlePivotQuickSort', middlePivotQuickSort],
  ['medianPivotQuickSort', medianPivotQuickSort],
  ['mergeSort', mergeSort],
  ['timSort', timSort],
  ['selectionSort', selectionSort],
  ['doubleSelectionSort', doubleSelectionSort],
  ['heapSort', heapSort],
  ['cycleSort', cycleSort],
  ['insertionSort', insertionSort],
  ['shellSort', shellSort],
  ['frankLazarusShellSort', frankLazarusShellSort],
  ['hibbardShellSort', hibbardShellSort],
  ['papernovStasevichShellSort', papernovStasevichShellSort],
  ['tokudaShellSort', tokudaShellSort],
  ['ciuraShellSort', ciuraShellSort],
  ['treeSort', treeSort],
  ['bubbleSort', bubbleSort],
  ['gnomeSort', gnomeSort],
  ['cocktailShakerSort', cocktailShakerSort],
  ['boundedCocktailShakerSort', boundedCocktailShakerSort],
  ['exchangeSort', exchangeSort],
  ['oddEvenSort', oddEvenSort],
  ['combSort', combSort],
  ['uniformKeysBucketSort', uniformKeysBucketSort],
  ['integerKeysBucketSort', integerKeysBucketSort],
  ['countingSort', countingSort],
  ['lsdRadixSort', lsdRadixSort],
  ['msdRadixSort', msdRadixSort],
  ['pancakeSort', pancakeSort],
  ['bitonicSort', bitonicSort],
  ['stoogeSort', stoogeSort],
  ['slowSort', slowSort],
  ['bogoSort', bogoSort]
]);