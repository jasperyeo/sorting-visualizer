import { SortingVisualizerComponent } from '../components/sorting-visualizer/sorting-visualizer.component';
import { SortBarInterface } from '../shared/models/sort-bar/sort-bar.constants';
import { compare, swap } from './common';

export async function gnomeSort(visualizer: SortingVisualizerComponent, array: SortBarInterface[]): Promise<void> {
  for (let i = 1; i < array.length; i++) {
    if (!visualizer.isSorting()) return;
    if (compare(visualizer, array[i - 1], array[i])) {
      await swapSublist(visualizer, array, i);
    }
  }
}

async function swapSublist(visualizer: SortingVisualizerComponent, array: SortBarInterface[], i: number): Promise<void> {
  for (; i > 0 && compare(visualizer, array[i - 1], array[i]); i--) {
    await swap(visualizer, array, i - 1, i);
  }
}