import { SortingVisualizerComponent } from '../components/sorting-visualizer/sorting-visualizer.component';
import { SortBarColor, SortBarComponent } from './../shared/models/sort-bar/sort-bar.component';
import { compare, swap } from './common';

export async function quickSort(visualizer: SortingVisualizerComponent, array: SortBarComponent[], left: number, right: number): Promise<void> {
  if (left < right) {
    const pivot: number = left;
    //array[pivot].color = SortBarColor.PIVOT;
    let i: number = left, j: number = right;
    array[j].color = SortBarColor.SWAP;
    while (i < j) {
      if (!visualizer.sorting) return;
      while (compare(visualizer, array[pivot], array[i]) && i < j) {
        array[i].color = SortBarColor.NORMAL;
        i++;
        array[i].color = SortBarColor.SWAP;
      }
      while (!compare(visualizer, array[pivot], array[j])) {
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
    await quickSort(visualizer, array, left, j - 1);
    await quickSort(visualizer, array, j + 1, right);
  }
}