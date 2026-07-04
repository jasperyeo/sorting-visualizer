import { SortingVisualizerComponent } from '../components/sorting-visualizer/sorting-visualizer.component';
import { SortBarInterface } from '../shared/models/sort-bar/sort-bar.constants';
import * as common from './common';

export async function stoogeSort(visualizer: SortingVisualizerComponent, array: SortBarInterface[]): Promise<void> {
  await stoogeSortRecursive(visualizer, array, 0, array.length - 1);
}

async function stoogeSortRecursive(visualizer: SortingVisualizerComponent, array: SortBarInterface[], i: number, j: number): Promise<void> {
  if (!visualizer.isSorting()) return;
  if (common.compare(visualizer, array[i], array[j])) {
    await common.swap(visualizer, array, i, j);
  }
  if ((j - i + 1) > 2) {
    const t: number = Math.floor((j - i + 1) / 3);
    await stoogeSortRecursive(visualizer, array, i, j - t);
    await stoogeSortRecursive(visualizer, array, i + t, j);
    await stoogeSortRecursive(visualizer, array, i, j - t);
  }
}