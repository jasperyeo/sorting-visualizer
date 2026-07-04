import { signal, WritableSignal } from '@angular/core';
import { SortingVisualizerComponent } from '../components/sorting-visualizer/sorting-visualizer.component';
import { SortBarInterface } from './../shared/models/sort-bar/sort-bar.component';
import { compare, swap } from './common';

export async function selectionSort(visualizer: SortingVisualizerComponent, array: SortBarInterface[]): Promise<void> {
  for (let i = 0; i < array.length; i++) {
    if (!visualizer.sorting) return;
    let min: WritableSignal<number> = signal<number>(i);
    for (let j = i + 1; j < array.length; j++) {
      if (!visualizer.sorting) return;
      if (compare(visualizer, array[min()], array[j])) {
        min.update(() => j);
      }
    }
    if (i !== min()) {
      await swap(visualizer, array, min(), i);
    }
  }
}

export async function doubleSelectionSort(visualizer: SortingVisualizerComponent, array: SortBarInterface[]): Promise<void> {
  for (let i: number = 0, j: number = array.length - 1; i < j; i++, j--) {
    let min: WritableSignal<number> = signal<number>(array[i].value);
    let max: WritableSignal<number> = signal<number>(array[i].value);
    let minI: WritableSignal<number> = signal<number>(i);
    let maxI: WritableSignal<number> = signal<number>(i);
    for (let k: number = i; k <= j; k++) {
      if (array[k].value > max()) {
        visualizer.noOfCompares++;
        max.update(() => array[k].value);
        maxI.update(() => k);
      } else if (array[k].value < min()) {
        visualizer.noOfCompares += 2;
        min.update(() => array[k].value);
        minI.update(() => k);
      }
    }
    await swap(visualizer, array, i, minI());
    visualizer.noOfCompares++;
    if (array[minI()].value === max()) {
      await swap(visualizer, array, j, minI());
    } else {
      await swap(visualizer, array, j, maxI());
    }
  }
}