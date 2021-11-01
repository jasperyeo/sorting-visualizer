import { SortingVisualizerComponent } from '../components/sorting-visualizer/sorting-visualizer.component';
import { SortBarComponent } from './../shared/models/sort-bar/sort-bar.component';
import { compare, swap } from './common';

export async function bubbleSort(visualizer: SortingVisualizerComponent, array: SortBarComponent[]): Promise<void> {
  for (let i = 0; i < array.length; i++) {
    if (!visualizer.sorting) return;
    for (let j = 0; j < (array.length - i - 1); j++) {
      if (!visualizer.sorting) return;
      if (compare(visualizer, array, j, j + 1)) {
        await swap(visualizer, array, j, j + 1);
      }
    }
  }
}