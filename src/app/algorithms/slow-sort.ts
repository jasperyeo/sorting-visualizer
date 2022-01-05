import { SortingVisualizerComponent } from '../components/sorting-visualizer/sorting-visualizer.component';
import { SortBarComponent } from './../shared/models/sort-bar/sort-bar.component';
import { compare, swap } from './common';

export async function slowSort(visualizer: SortingVisualizerComponent, array: SortBarComponent[]): Promise<void> {
  await slowSortRecursive(visualizer, array, 0, array.length - 1);
}

async function slowSortRecursive(visualizer: SortingVisualizerComponent, array: SortBarComponent[], i: number, j: number): Promise<void> {
  if (i >= j || !visualizer.sorting) return;
  const m: number = Math.floor((i + j) / 2);
  await slowSortRecursive(visualizer, array, i, m);
  await slowSortRecursive(visualizer, array, m + 1, j);
  if (compare(visualizer, array[m], array[j])) {
    await swap(visualizer, array, j, m);
  }
  await slowSortRecursive(visualizer, array, i, j - 1);
}