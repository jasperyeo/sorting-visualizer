import { SortingVisualizerComponent } from '../components/sorting-visualizer/sorting-visualizer.component';
import { SortBarColor, SortBarComponent } from './../shared/models/sort-bar/sort-bar.component';
import { compare, swap } from './common';

export async function quickSort(visualizer: SortingVisualizerComponent, array: SortBarComponent[]): Promise<void> {
  await quickSortRecursive(visualizer, array, 0, array.length - 1);
}

async function quickSortRecursive(visualizer: SortingVisualizerComponent, array: SortBarComponent[], left: number, right: number): Promise<void> {
  if (left < right) {
    const pivot: number = left;
    //array[pivot].color = SortBarColor.PIVOT;
    let i: number = left, j: number = right;
    array[j].color = SortBarColor.SWAP;
    while (i < j) {
      if (!visualizer.sorting) return;
      array[pivot].color = SortBarColor.PIVOT;
      while (compare(visualizer, array[pivot], array[i], true) && i < j) {
        array[i].color = SortBarColor.NORMAL;
        i++;
        array[i].color = SortBarColor.SWAP;
      }
      while (!compare(visualizer, array[pivot], array[j], true)) {
        array[j].color = SortBarColor.NORMAL;
        j--;
        array[j].color = SortBarColor.SWAP;
      }
      //array[pivot].color = SortBarColor.PIVOT;
      if (i < j) {
        await swap(visualizer, array, i, j);
      }
    }
    await swap(visualizer, array, pivot, j);
    array[i].color = SortBarColor.NORMAL;
    array[j].color = SortBarColor.NORMAL;
    array[pivot].color = SortBarColor.NORMAL;
    await quickSortRecursive(visualizer, array, left, j - 1);
    await quickSortRecursive(visualizer, array, j + 1, right);
  }
}