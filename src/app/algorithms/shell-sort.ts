import { SortingVisualizerComponent } from '../components/sorting-visualizer/sorting-visualizer.component';
import { SortBarColor, SortBarComponent } from './../shared/models/sort-bar/sort-bar.component';
import { compare } from './common';

export async function shellSort(visualizer: SortingVisualizerComponent, array: SortBarComponent[]): Promise<void> {
  // (N / 2^k)
  for (let gap: number = Math.floor(array.length / 2); gap > 0; gap = Math.floor(gap / 2)) {
    if (!visualizer.sorting) return;
    await shellSortConcrete(visualizer, array, gap);
  }
}

export async function frankLazarusShellSort(visualizer: SortingVisualizerComponent, array: SortBarComponent[]): Promise<void> {
  // 2(N / 2^(k+1)) + 1
  for (let k: number = 1, gap: number = Math.floor(2 * (array.length / Math.pow(2, k + 1)) + 1); gap > 0; k++, gap = Math.floor(2 * (array.length / Math.pow(2, k + 1)) + 1)) {
    if (!visualizer.sorting) return;
    await shellSortConcrete(visualizer, array, gap);
    if (gap <= 1) break;
  }
}

export async function hibbardShellSort(visualizer: SortingVisualizerComponent, array: SortBarComponent[]): Promise<void> {
  // 2^k - 1
  let maxK: number = 1, initK: number = 1;
  while (maxK < array.length) {
    maxK = Math.pow(2, initK);
    initK++;
  }
  for (let k: number = initK, gap: number = Math.pow(2, k) - 1; gap > 0; k--, gap = Math.pow(2, k) - 1) {
    if (!visualizer.sorting) return;
    await shellSortConcrete(visualizer, array, gap);
  }
}

export async function tokudaShellSort(visualizer: SortingVisualizerComponent, array: SortBarComponent[]): Promise<void> {
  // a(n) = ceiling( (9 * (9/4)^n - 4) / 5)
  let maxK: number = 1, initK: number = 1;
  while (maxK < array.length) {
    maxK = Math.pow(2, initK);
    initK++;
  }
  for (let k: number = initK, gap: number = Math.ceil((9 * Math.pow(9 / 4, k) - 4) / 5); gap > 0; k--, gap = Math.ceil((9 * Math.pow(9 / 4, k) - 4) / 5)) {
    if (!visualizer.sorting) return;
    await shellSortConcrete(visualizer, array, gap);
  }
}

export async function ciuraShellSort(visualizer: SortingVisualizerComponent, array: SortBarComponent[]): Promise<void> {
  // 1, 4, 10, 23, 57, 132, 301, 701, 1750 (experimental integer sequence)
  const ciuraSequence: number[] = [1750, 701, 301, 132, 57, 23, 10, 4, 1];
  for (let n: number = 0, gap: number = ciuraSequence[n]; gap > 0; n++, gap = ciuraSequence[n]) {
    if (!visualizer.sorting) return;
    await shellSortConcrete(visualizer, array, gap);
  }
}

async function shellSortConcrete(visualizer: SortingVisualizerComponent, array: SortBarComponent[], gap: number): Promise<void> {
  for (let i: number = gap; i < array.length; i += 1) {
    if (!visualizer.sorting) return;
    let temp = array[i];
    let j: number;
    for (j = i; j >= gap && compare(visualizer, array[j - gap], temp); j -= gap)  {
      if (!visualizer.sorting) return;
      array[j - gap].color = SortBarColor.SWAP;
      if (visualizer.enableAudio) visualizer.playBeep(array[j].value);
      if (visualizer.enableAudio) visualizer.playBeep(array[j - gap].value);
      visualizer.noOfSwaps++;
      array[j] = array[j - gap];
      await visualizer.sleep(visualizer.sortDelay);
      array[j].color = SortBarColor.NORMAL;
    }
    array[j] = temp;
  }
}