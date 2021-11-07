import { SortingVisualizerComponent } from '../components/sorting-visualizer/sorting-visualizer.component';
import { SortBarComponent } from './../shared/models/sort-bar/sort-bar.component';
import { compare, swap } from './common';

export async function selectionSort(visualizer: SortingVisualizerComponent, array: SortBarComponent[]): Promise<void> {
  for (let i = 0; i < array.length; i++) {
    if (!visualizer.sorting) return;
    let min: number = i;
    for (let j = i + 1; j < array.length; j++) {
      if (!visualizer.sorting) return;
      if (compare(visualizer, array[min], array[j])) {
        min = j;
      }
    }
    if (i !== min) {
      await swap(visualizer, array, min, i);
    }
  }
}