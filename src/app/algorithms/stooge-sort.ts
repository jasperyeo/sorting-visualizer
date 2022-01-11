import { SortingVisualizerComponent } from '../components/sorting-visualizer/sorting-visualizer.component';
import { SortBarComponent } from './../shared/models/sort-bar/sort-bar.component';
import { compare, swap } from './common';

export async function stoogeSort(visualizer: SortingVisualizerComponent, array: SortBarComponent[]): Promise<void> {
  await stoogeSortRecursive(visualizer, array, 0, array.length - 1);
}

async function stoogeSortRecursive(visualizer: SortingVisualizerComponent, array: SortBarComponent[], i: number, j: number): Promise<void> {
  if (!visualizer.sorting) return;
  if (compare(visualizer, array[i], array[j])) {
    await swap(visualizer, array, i, j);
  }
  if ((j - i + 1) > 2) {
    const t: number = Math.floor((j - i + 1) / 3);
    await stoogeSortRecursive(visualizer, array, i, j - t);
    await stoogeSortRecursive(visualizer, array, i + t, j);
    await stoogeSortRecursive(visualizer, array, i, j - t);
  }
}