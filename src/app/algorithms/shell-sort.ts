import { SortingVisualizerComponent } from '../components/sorting-visualizer/sorting-visualizer.component';
import { SortBarColor, SortBarComponent } from './../shared/models/sort-bar/sort-bar.component';
import { compare } from './common';

export async function shellSort(visualizer: SortingVisualizerComponent, array: SortBarComponent[]): Promise<void> {
  for (let gap: number = Math.floor(array.length / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i: number = gap; i < array.length; i += 1) {
      let temp = array[i];
      let j: number;
      for (j = i; j >= gap && compare(visualizer, array[j - gap], temp); j -= gap)  {
        array[j - gap].color = SortBarColor.SWAP;
        visualizer.noOfSwaps++;
        array[j] = array[j - gap];
        await visualizer.sleep(visualizer.sortDelay);
        array[j].color = SortBarColor.NORMAL;
      }
      array[j] = temp;
    }
  }
}