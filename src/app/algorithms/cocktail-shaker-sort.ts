import { signal, WritableSignal } from '@angular/core';
import { SortingVisualizerComponent } from '../components/sorting-visualizer/sorting-visualizer.component';
import { SortBarInterface } from '../shared/models/sort-bar/sort-bar.constants';
import { compare, swap } from './common';

export async function cocktailShakerSort(visualizer: SortingVisualizerComponent, array: SortBarInterface[]): Promise<void> {
  let isSorted: WritableSignal<boolean> = signal<boolean>(true);
  while (isSorted()) {
    if (!visualizer.isSorting()) return;
    for (let i: number = 0; i < array.length - 1; i++) {
      if (!visualizer.isSorting()) return;
      if (compare(visualizer, array[i], array[i + 1])) {
        await swap(visualizer, array, i, i + 1);
        isSorted.update(() => true);
      }
    }
    if (!isSorted()) break;
    isSorted = signal<boolean>(false);
    for (let j: number = array.length - 1; j > 0; j--) {
      if (!visualizer.isSorting()) return;
      if (compare(visualizer, array[j - 1], array[j])) {
        await swap(visualizer, array, j - 1, j);
        isSorted.update(() => true);
      }
    }
  }
}

export async function boundedCocktailShakerSort(visualizer: SortingVisualizerComponent, array: SortBarInterface[]): Promise<void> {
  let startIndex: WritableSignal<number> = signal<number>(0);
  let endIndex: WritableSignal<number> = signal<number>(array.length);
  for (endIndex.update((originalEndIndex) => --originalEndIndex); startIndex() < endIndex();) {
    if (!visualizer.isSorting()) return;
    let newStartIndex: WritableSignal<number> = signal<number>(endIndex());
    let newEndIndex: WritableSignal<number> = signal<number>(startIndex());
    for (let i: number = startIndex(); i < endIndex(); i++) {
      if (!visualizer.isSorting()) return;
      if (compare(visualizer, array[i], array[i + 1])) {
        await swap(visualizer, array, i, i + 1);
        newEndIndex.update(() => i);
      }
    }
    endIndex.update(() => newEndIndex());
    for (let i: number = endIndex(); i > startIndex(); i--) {
      if (!visualizer.isSorting()) return;
      if (compare(visualizer, array[i - 1], array[i])) {
        await swap(visualizer, array, i - 1, i);
        newStartIndex.update(() => i);
      }
    }
    startIndex.update(() => newStartIndex());
  }
}