import { signal, WritableSignal } from '@angular/core';
import { SortingVisualizerComponent } from '../components/sorting-visualizer/sorting-visualizer.component';
import { SortBarInterface } from './../shared/models/sort-bar/sort-bar.component';
import { compare, swap } from './common';

export async function oddEvenSort(visualizer: SortingVisualizerComponent, array: SortBarInterface[]): Promise<void> {
  let sorted: WritableSignal<boolean> = signal<boolean>(false);
  while (!sorted()) {
    if (!visualizer.sorting) return;
    sorted.update(() => true);
    for (let i: number = 1; i < array.length - 1; i += 2) {
      if (!visualizer.sorting) return;
      if (compare(visualizer, array[i], array[i + 1])) {
        await swap(visualizer, array, i, i + 1);
        sorted.update(() => false);
      }
    }
    for (let i: number = 0; i < array.length - 1; i += 2) {
      if (!visualizer.sorting) return;
      if (compare(visualizer, array[i], array[i + 1])) {
        await swap(visualizer, array, i, i + 1);
        sorted.update(() => false);
      }
    }
  }
}