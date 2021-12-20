import { SortingVisualizerComponent } from '../components/sorting-visualizer/sorting-visualizer.component';
import { SortBarComponent } from './../shared/models/sort-bar/sort-bar.component';
import { compare, swap } from './common';

export async function combSort(visualizer: SortingVisualizerComponent, array: SortBarComponent[]): Promise<void> {
  const shrink: number = 1.3;
  let gap: number = array.length;
  let sorted: boolean = false;
  while (!sorted) {
    if (!visualizer.sorting) return;
    gap = Math.floor(gap / shrink);
    if (gap <= 1) {
      sorted = true;
      gap = 1;
    }
    for (let i: number = 0; i < array.length - gap; i++) {
      if (!visualizer.sorting) return;
      const gapIndex: number = gap + i;
      if (compare(visualizer, array[i], array[gapIndex])) {
        await swap(visualizer, array, i, gapIndex);
        sorted = false;
      }
    }
  }
}