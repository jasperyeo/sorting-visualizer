import { SortingVisualizerComponent } from '../components/sorting-visualizer/sorting-visualizer.component';
import { SortBarComponent } from './../shared/models/sort-bar/sort-bar.component';
import { compare, swap } from './common';

export async function cocktailShakerSort(visualizer: SortingVisualizerComponent, array: SortBarComponent[]): Promise<void> {
  let isSorted: boolean = true;
  while (isSorted) {
    for (let i: number = 0; i < array.length - 1; i++) {
      if (compare(visualizer, array[i], array[i + 1])) {
        await swap(visualizer, array, i, i + 1);
        isSorted = true;
      }
    }
    if (!isSorted) break;
    isSorted = false;
    for (let j: number = array.length - 1; j > 0; j--) {
      if (compare(visualizer, array[j - 1], array[j])) {
        await swap(visualizer, array, j - 1, j);
        isSorted = true;
      }
    }
  }
}