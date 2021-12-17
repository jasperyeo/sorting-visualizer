import { SortingVisualizerComponent } from '../components/sorting-visualizer/sorting-visualizer.component';
import { SortBarComponent } from './../shared/models/sort-bar/sort-bar.component';
import { compare, swap } from './common';

export async function heapSort(visualizer: SortingVisualizerComponent, array: SortBarComponent[]): Promise<void> {
  for (let i: number = Math.floor(array.length / 2 - 1); i >= 0; i--) {
    if (!visualizer.sorting) return;
    await heapify(visualizer, array, array.length, i);
  }
  for (let i: number = array.length - 1; i >= 0; i--) {
    if (!visualizer.sorting) return;
    await swap(visualizer, array, 0, i);
    await heapify(visualizer, array, i, 0);
  }
}

async function heapify(visualizer: SortingVisualizerComponent, array: SortBarComponent[], size: number, i: number): Promise<void> {
  let max: number = i;
  const left: number = 2 * i + 1, right: number = 2 * i + 2;
  if (left < size && compare(visualizer, array[left], array[max])) {
    max = left;
  }
  if (right < size && compare(visualizer, array[right], array[max])) {
    max = right;
  }
  if (max !== i) {
    await swap(visualizer, array, i, max);
    await heapify(visualizer, array, size, max);
  }
}