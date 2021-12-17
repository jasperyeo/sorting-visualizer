import { SortingVisualizerComponent } from '../components/sorting-visualizer/sorting-visualizer.component';
import { SortBarComponent } from './../shared/models/sort-bar/sort-bar.component';
import { compare, swap } from './common';

export async function bitonicSort(visualizer: SortingVisualizerComponent, array: SortBarComponent[]): Promise<void> {
  const n: number = array.length;
  let k: number, j: number, l: number, i: number;
  for (k = 2; k <= n; k *= 2) {
    for (j = k / 2; j > 0; j /= 2) {
      for (i = 0; i < n; i++) {
        l = i ^ j;
        if (l > i) {
          if ( ((i&k)==0) && compare(visualizer, array[i], array[l]) || ( ((i&k)!=0) && compare(visualizer, array[l], array[i])) )  {
            await swap(visualizer, array, i, l);
          }
        }
      }
    }
  }
}