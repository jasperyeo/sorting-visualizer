import { signal, WritableSignal } from '@angular/core';
import { SortingVisualizerComponent } from '../components/sorting-visualizer/sorting-visualizer.component';
import { SortBarInterface } from '../shared/models/sort-bar/sort-bar.constants';
import { compare, swap } from './common';

export async function insertionSort(visualizer: SortingVisualizerComponent, array: SortBarInterface[], left: number = 0, right: number = array.length): Promise<void> {
  let key: WritableSignal<SortBarInterface | null> = signal<SortBarInterface | null>(null), j: WritableSignal<number> = signal<number>(0);
  for (let i: number = left + 1; i < right; i++) {
    if (!visualizer.isSorting()) return;
    key.update(() => array[i]);
    j.update(() => i - 1);
    while (j() >= left && compare(visualizer, array[j()], key()!)) {
      if (!visualizer.isSorting()) return;
      await swap(visualizer, array, j() + 1, j());
      j.update(() => j() - 1);
    }
    array[j() + 1] = key()!;
  }
}