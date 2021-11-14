import { SortingVisualizerComponent } from '../components/sorting-visualizer/sorting-visualizer.component';
import { SortBarComponent } from './../shared/models/sort-bar/sort-bar.component';
import { compare, swap } from './common';

export async function insertionSort(visualizer: SortingVisualizerComponent, array: SortBarComponent[]): Promise<void> {
  let key: SortBarComponent, j: number;
  for (let i: number = 1; i < array.length; i++) {
    if (!visualizer.sorting) return;
    key = array[i];
    j = i - 1;
    while (j >= 0 && compare(visualizer, array[j], key)) {
      if (!visualizer.sorting) return;
      await swap(visualizer, array, j + 1, j);
      j = j - 1;
    }
    array[j + 1] = key;
  }
}