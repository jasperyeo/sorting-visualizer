import { signal, WritableSignal } from '@angular/core';
import { SortingVisualizerComponent } from '../components/sorting-visualizer/sorting-visualizer.component';
import { SortBarInterface } from './../shared/models/sort-bar/sort-bar.component';
import { compare, swap } from './common';

export async function pancakeSort(visualizer: SortingVisualizerComponent, array: SortBarInterface[]): Promise<void> {
  let pancakes: WritableSignal<number> = signal<number>(array.length);
  while (pancakes() > 1) {
    if (!visualizer.sorting) return;
    let maxIndex: number = maxHeight(visualizer, array, pancakes());
    if (maxIndex !== pancakes()) {
      await flip(visualizer, array, maxIndex);
      await flip(visualizer, array, pancakes() - 1);
      let currentFlips: number = parseInt(visualizer.sortStats[0].value);
      visualizer.sortStats[0].value = (currentFlips + 2).toString();
    }
    pancakes.update(() => pancakes() - 1);
  }
}

function maxHeight(visualizer: SortingVisualizerComponent, array: SortBarInterface[], maxHeightIndex: number): number {
  let heightIndex: WritableSignal<number> = signal<number>(0);
  for (let i: number = 0; i < maxHeightIndex; i++) {
    if (compare(visualizer, array[i], array[heightIndex()])) {
      heightIndex.update(() => i);
    }
  }
  return heightIndex();
}

async function flip(visualizer: SortingVisualizerComponent, array: SortBarInterface[], flipIndex: number): Promise<void> {
  let left: WritableSignal<number> = signal<number>(0);
  while (left() < flipIndex) {
    if (!visualizer.sorting) return;
    await swap(visualizer, array, left(), flipIndex);
    flipIndex--;
    left.update(() => left() + 1);
  }
}