import { SortingVisualizerComponent } from '../components/sorting-visualizer/sorting-visualizer.component';
import { SortBarComponent } from './../shared/models/sort-bar/sort-bar.component';
import { compare, swap } from './common';

export async function bogoSort(visualizer: SortingVisualizerComponent, array: SortBarComponent[]): Promise<void> {
  let sorted: boolean = false;
  while(!sorted) {
    if (!visualizer.sorting) return;
    await shuffle(visualizer, array);
    sorted = isSorted(visualizer, array);
  }
}

async function shuffle(visualizer: SortingVisualizerComponent, array: SortBarComponent[]) {
  let count: number = array.length, index: number;
  while (count > 0) {
    if (!visualizer.sorting) return;
    index = Math.floor(Math.random() * count);
    count--;
    await swap(visualizer, array, count, index);
  }
}

function isSorted(visualizer: SortingVisualizerComponent, array: SortBarComponent[]): boolean {
  for (let i: number = 1; i < array.length; i++){
    if (compare(visualizer, array[i - 1], array[i])) {
      return false;
    }
  }
  return true;
}