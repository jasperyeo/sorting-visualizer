import { SortingVisualizerComponent } from '../components/sorting-visualizer/sorting-visualizer.component';
import { SortBarComponent } from './../shared/models/sort-bar/sort-bar.component';
import { compare, swap } from './common';

export async function exchangeSort(visualizer: SortingVisualizerComponent, array: SortBarComponent[]): Promise<void> {
  for (let i: number = 0; i < array.length - 1; i++) {
    if (!visualizer.sorting) return;
    for (let j: number = i + 1; j < array.length; j++) {
      if (!visualizer.sorting) return;
      if (compare(visualizer, array[i], array[j])) {
        await swap(visualizer, array, i, j);
      }
    }
  }
}