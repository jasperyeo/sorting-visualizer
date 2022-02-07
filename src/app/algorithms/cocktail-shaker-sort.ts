import { SortingVisualizerComponent } from '../components/sorting-visualizer/sorting-visualizer.component';
import { SortBarComponent } from './../shared/models/sort-bar/sort-bar.component';
import { compare, swap } from './common';

export async function cocktailShakerSort(visualizer: SortingVisualizerComponent, array: SortBarComponent[]): Promise<void> {
  let isSorted: boolean = true;
  while (isSorted) {
    if (!visualizer.sorting) return;
    for (let i: number = 0; i < array.length - 1; i++) {
      if (!visualizer.sorting) return;
      if (compare(visualizer, array[i], array[i + 1])) {
        await swap(visualizer, array, i, i + 1);
        isSorted = true;
      }
    }
    if (!isSorted) break;
    isSorted = false;
    for (let j: number = array.length - 1; j > 0; j--) {
      if (!visualizer.sorting) return;
      if (compare(visualizer, array[j - 1], array[j])) {
        await swap(visualizer, array, j - 1, j);
        isSorted = true;
      }
    }
  }
}

export async function boundedCocktailShakerSort(visualizer: SortingVisualizerComponent, array: SortBarComponent[]): Promise<void> {
  let startIndex: number = 0;
  let endIndex: number = array.length;
  for (--endIndex; startIndex < endIndex;) {
    if (!visualizer.sorting) return;
    let newStartIndex: number = endIndex;
    let newEndIndex: number = startIndex;
    for (let i: number = startIndex; i < endIndex; ++i) {
      if (!visualizer.sorting) return;
      if (compare(visualizer, array[i], array[i + 1])) {
        await swap(visualizer, array, i, i + 1);
        newEndIndex = i;
      }
    }
    endIndex = newEndIndex;
    for (let i: number = endIndex; i > startIndex; --i) {
      if (!visualizer.sorting) return;
      if (compare(visualizer, array[i - 1], array[i])) {
        await swap(visualizer, array, i - 1, i);
        newStartIndex = i;
      }
    }
    startIndex = newStartIndex;
  }
}