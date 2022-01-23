import { SortingVisualizerComponent } from '../components/sorting-visualizer/sorting-visualizer.component';
import { SortBarComponent } from './../shared/models/sort-bar/sort-bar.component';
import { insertionSort } from './insertion-sort';
import { mergeSort } from './merge-sort';

const MIN_MERGE: number = 32;

export async function timSort(visualizer: SortingVisualizerComponent, array: SortBarComponent[]): Promise<void> {
  const minRun: number = minRunLength(MIN_MERGE);
  const n: number = array.length;
  for (let i: number = 0; i < n; i += minRun) {
    if (!visualizer.sorting) return;
    const right: number = Math.min((i + MIN_MERGE), n);
    await insertionSort(visualizer, array, i, right);
  }
  await mergeSort(visualizer, array);
}

function minRunLength(n: number): number {
  let r: number = 0;
  while (n >= MIN_MERGE) {
    r |= (n & 1);
    n >>= 1;
  }
  return n + r;
}