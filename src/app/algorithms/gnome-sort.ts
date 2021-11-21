import { SortingVisualizerComponent } from '../components/sorting-visualizer/sorting-visualizer.component';
import { SortBarComponent } from './../shared/models/sort-bar/sort-bar.component';
import { compare, swap } from './common';

export async function gnomeSort(visualizer: SortingVisualizerComponent, array: SortBarComponent[]): Promise<void> {
  for (let i = 1; i < array.length; i++) {
    if (!visualizer.sorting) return;
    if (compare(visualizer, array[i - 1], array[i])) {
      await swapSublist(visualizer, array, i);
    }
  }
}

async function swapSublist(visualizer: SortingVisualizerComponent, array: SortBarComponent[], i: number): Promise<void> {
  for (; i > 0 && compare(visualizer, array[i - 1], array[i]); i--) {
    await swap(visualizer, array, i - 1, i);
  }
}