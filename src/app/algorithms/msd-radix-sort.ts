import { SortingVisualizerComponent } from '../components/sorting-visualizer/sorting-visualizer.component';
import { SortBarColor, SortBarInterface } from '../shared/models/sort-bar/sort-bar.constants';
import { flatten } from './common';

export async function msdRadixSort(visualizer: SortingVisualizerComponent, array: SortBarInterface[]): Promise<void> {
  const maxCount: number = Math.max(...array.map(elem => elem.value)).toString().length;
  console.log(`Max Count: ${maxCount}`);
  array.forEach(elem => {
    elem.valueString = elem.valueString.padStart(maxCount, "0");
  });
  let msdArray: any[] = array;
  await bucketSortByDigit(visualizer, array, msdArray, 0, maxCount);
}

async function bucketSortByDigit(visualizer: SortingVisualizerComponent, originalArray: SortBarInterface[], array: any[], digit: number, maxCount: number): Promise<any[]> {
  if (digit >= maxCount || array.length <= 1) return array;
  let buckets: Array<SortBarInterface[]> = [[],[],[],[],[],[],[],[],[],[]];
  for (let i: number = array.length - 1; i >= 0; i--) {
    if (!visualizer.isSorting()) break;
    buckets[parseInt(array[i].valueString.charAt(digit))].push(array.splice(i, 1)[0]);
  }
  let proxyArray: any[] = flatten(buckets);
  for (let j: number = 0; j < proxyArray.length; j++) {
    if (!visualizer.isSorting()) break;
    array[j] = proxyArray[j];
    array[j].color = SortBarColor.SWAP;
    if (visualizer.isAudioEnabled()) visualizer.playBeep(array[j].value);
    visualizer.noOfCompares.update((value) => value + 1);
    visualizer.noOfSwaps.update((value) => value + 1);
    await visualizer.sleep(visualizer.sortDelay);
    array[j].color = SortBarColor.NORMAL;
  }
  for (let i: number = buckets.length - 1; i >= 0; i--) {
    if (!visualizer.isSorting()) break;
    if (buckets[i].length === 0) {
      buckets.splice(i, 1);
      continue;
    }
    if (buckets[i].length > 1) {
      buckets[i] = await bucketSortByDigit(visualizer, originalArray, buckets[i], digit + 1, maxCount);
      const proxyArray: any[] = flatten(buckets);
      for (let j: number = 0; j < proxyArray.length; j++) {
        if (!visualizer.isSorting()) break;
        array[j] = proxyArray[j];
        array[j].color = SortBarColor.SWAP;
        if (visualizer.isAudioEnabled()) visualizer.playBeep(array[j].value);
        await visualizer.sleep(visualizer.sortDelay);
        array[j].color = i % 2 ? SortBarColor.PIVOT : SortBarColor.NORMAL;
      }
    }
  }
  return buckets;
}

