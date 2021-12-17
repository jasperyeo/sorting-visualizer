import { SortingVisualizerComponent } from '../components/sorting-visualizer/sorting-visualizer.component';
import { SortBarComponent } from './../shared/models/sort-bar/sort-bar.component';
import { compare, swap } from './common';

export async function oddEvenSort(visualizer: SortingVisualizerComponent, array: SortBarComponent[]): Promise<void> {
  let sorted: boolean = false;
  while (!sorted) {
    if (!visualizer.sorting) return;
    sorted = true;
    for (let i: number = 1; i < array.length - 1; i += 2) {
      if (compare(visualizer, array[i], array[i + 1])) {
        await swap(visualizer, array, i, i + 1);
        sorted = false;
      }
    }
    for (let i: number = 0; i < array.length - 1; i += 2) {
      if (compare(visualizer, array[i], array[i + 1])) {
        await swap(visualizer, array, i, i + 1);
        sorted = false;
      }
    }
  }
}