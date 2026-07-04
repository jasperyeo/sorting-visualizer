import { SortingVisualizerComponent } from '../components/sorting-visualizer/sorting-visualizer.component';
import { SortBarInterface } from '../shared/models/sort-bar/sort-bar.constants';
import { compare, swap } from './common';

export async function bubbleSort(visualizer: SortingVisualizerComponent, array: SortBarInterface[]): Promise<void> {
  for (let i = 0; i < array.length; i++) {
    if (!visualizer.isSorting()) return;
    for (let j = 0; j < (array.length - i - 1); j++) {
      if (!visualizer.isSorting()) return;
      if (compare(visualizer, array[j], array[j + 1])) {
        await swap(visualizer, array, j, j + 1);
      }
    }
  }
}