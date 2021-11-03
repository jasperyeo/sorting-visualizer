import { SortingVisualizerComponent } from '../components/sorting-visualizer/sorting-visualizer.component';
import { SortBarComponent } from './../shared/models/sort-bar/sort-bar.component';
import { compare, swap } from './common';

export async function insertionSort(visualizer: SortingVisualizerComponent, array: SortBarComponent[]): Promise<void> {
  let key: SortBarComponent, j: number;
  for (let i: number = 1; i < array.length; i++) {
    key = array[i];
    j = i - 1;
    while (j >= 0 && array[j].value > key.value) {
      await swap(visualizer, array, j + 1, j);
      j = j - 1;
    }
    array[j + 1] = key;
  }
}

/*

function insertionSort(arr, n)
{
    let i, key, j;
    for (i = 1; i < n; i++)
    {
        key = arr[i];
        j = i - 1;

        while (j >= 0 && arr[j] > key)
        {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}
*/