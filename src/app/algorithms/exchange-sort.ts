import { SortingVisualizerComponent } from '../components/sorting-visualizer/sorting-visualizer.component';
import { SortBarInterface } from '../shared/models/sort-bar/sort-bar.constants';
import { compare, swap } from './common';

export async function exchangeSort(visualizer: SortingVisualizerComponent, array: SortBarInterface[]): Promise<void> {
  for (let i: number = 0; i < array.length - 1; i++) {
    if (!visualizer.isSorting()) return;
    for (let j: number = i + 1; j < array.length; j++) {
      if (!visualizer.isSorting()) return;
      if (compare(visualizer, array[i], array[j])) {
        await swap(visualizer, array, i, j);
      }
    }
  }
}