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

async function reverseSelectionSort(visualizer: SortingVisualizerComponent, array: SortBarComponent[]): Promise<void> {
  for (let i = array.length - 1; i >= 0; i--) {
    if (!visualizer.sorting) return;
    let max: number = i;
    for (let j = i - 1; j >= 0; j--) {
      if (!visualizer.sorting) return;
      if (compare(visualizer, array[j], array[max])) {
        max = j;
      }
    }
    if (i !== max) {
      await swap(visualizer, array, max, i);
    }
  }
}

export async function doubleSelectionSort(visualizer: SortingVisualizerComponent, array: SortBarComponent[]): Promise<void> {
  for (let i: number = 0, j: number = array.length - 1; i < j; i++, j--) {
    let min: number = array[i].value, max: number = array[i].value;
    let minI: number = i, maxI: number = i;
    for (let k: number = i; k <= j; k++) {
      if (array[k].value > max) {
        visualizer.noOfCompares++;
        max = array[k].value;
        maxI = k;
      } else if (array[k].value < min) {
        visualizer.noOfCompares += 2;
        min = array[k].value;
        minI = k;
      }
    }
    await swap(visualizer, array, i, minI);
    visualizer.noOfCompares++;
    if (array[minI].value === max) {
      await swap(visualizer, array, j, minI);
    } else {
      await swap(visualizer, array, j, maxI);
    }
  }
}