import { SortingVisualizerComponent } from '../components/sorting-visualizer/sorting-visualizer.component';
import { SortBarColor, SortBarInterface } from '../shared/models/sort-bar/sort-bar.constants';
import { flatten } from './common';
import { insertionSort } from './insertion-sort';

export async function uniformKeysBucketSort(visualizer: SortingVisualizerComponent, array: SortBarInterface[]): Promise<void> {
  const n: number = array.length;
  const max: number = Math.max(...array.map(elem => elem.value));
  let buckets: Array<SortBarInterface[]> = [];
  for (let i: number = 0; i < n; i++) {
    buckets.push([]);
  }
  array.forEach((element: SortBarInterface) => {
    buckets[Math.floor(n * element.value / max) - 1].push(element);
  });
  let totalCount: number = 0;
  for (let i: number = 0; i < buckets.length; i++) {
    for (let j: number = 0; j < buckets[i].length; j++) {
      if (!visualizer.isSorting()) break;
      array[totalCount] = buckets[i][j];
      array[totalCount].color = SortBarColor.SWAP;
      if (visualizer.isAudioEnabled()) visualizer.playBeep(array[totalCount].value);
      visualizer.noOfCompares.update((value) => value + 1);
      visualizer.noOfSwaps.update((value) => value + 1);
      await visualizer.sleep();
      array[totalCount].color = i % 2 ? SortBarColor.PIVOT : SortBarColor.NORMAL;
      totalCount++;
    }
  }
  for (let i: number = 0; i < buckets.length; i++) {
    await insertionSort(visualizer, buckets[i]);
  }
  const finalArray: any[] = flatten(buckets);
  for (let i: number = 0; i < n; i++) {
    if (!visualizer.isSorting()) break;
    array[i] = finalArray[i];
    array[i].color = SortBarColor.SWAP;
    if (visualizer.isAudioEnabled()) visualizer.playBeep(array[i].value);
    await visualizer.sleep();
    array[i].color = SortBarColor.NORMAL;
  }
}