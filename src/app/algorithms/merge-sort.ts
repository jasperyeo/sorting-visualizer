import { SortingVisualizerComponent } from '../components/sorting-visualizer/sorting-visualizer.component';
import { SortBarColor, SortBarComponent } from './../shared/models/sort-bar/sort-bar.component';
import { compare } from './common';

export async function mergeSort(visualizer: SortingVisualizerComponent, array: SortBarComponent[]): Promise<void> {
  await mergeSortRecursive(visualizer, array, 0, array.length);
}

export async function mergeSortRecursive(visualizer: SortingVisualizerComponent, array: SortBarComponent[], start: number, end: number): Promise<void> {
  if (start >= end - 1) return;
  const mid: number = start + Math.trunc((end - start) / 2);
  await mergeSortRecursive(visualizer, array, start, mid);
  await mergeSortRecursive(visualizer, array, mid, end);
  const cloned: SortBarComponent[] = Array(end - start).fill(array[0]);
  let k: number = mid;

  for (let i = start, r = 0; i < mid; r++, i++) {
    if (!visualizer.sorting) return;
    while (k < end && compare(visualizer, array[i], array[k])) {
      cloned[r] = array[k];
      r++;
      k++;
    }
    cloned[r] = array[i];
  }

  for (let i = 0; i < k - start; i++) {
    if (!visualizer.sorting) return;
    array[i + start] = cloned[i];
    array[i + start].color = SortBarColor.SWAP;
    visualizer.noOfSwaps++;
    if (visualizer.enableAudio) visualizer.playBeep(array[i + start].value);
    await visualizer.sleep(visualizer.sortDelay);
    array[i + start].color = SortBarColor.NORMAL;
  }
}