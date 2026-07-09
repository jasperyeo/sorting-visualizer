import { signal, WritableSignal } from '@angular/core';
import { SortingVisualizerComponent } from '../components/sorting-visualizer/sorting-visualizer.component';
import { SortBarInterface } from '../shared/models/sort-bar/sort-bar.constants';
import { swap, isSorted } from './common';

export async function bogoSort(visualizer: SortingVisualizerComponent, array: SortBarInterface[]): Promise<void> {
  let sorted: WritableSignal<boolean> = signal<boolean>(false);
  while(!sorted()) {
    if (!visualizer.isSorting()) return;
    await shuffle(visualizer, array);
    sorted.update(() => isSorted(visualizer, array));
  }
}

async function shuffle(visualizer: SortingVisualizerComponent, array: SortBarInterface[]) {
  let count: WritableSignal<number> = signal<number>(array.length);
  let index: WritableSignal<number> = signal<number>(0);
  while (count() > 0) {
    if (!visualizer.isSorting()) return;
    index.update(() => Math.floor(Math.random() * count()));
    count.update(() => count() - 1);
    await swap(visualizer, array, count(), index());
  }
}