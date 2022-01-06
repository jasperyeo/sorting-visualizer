import { SortingVisualizerComponent } from '../components/sorting-visualizer/sorting-visualizer.component';
import { SortBarColor, SortBarComponent } from './../shared/models/sort-bar/sort-bar.component';
import { flatten } from './common';

export async function uniformKeysBucketSort(visualizer: SortingVisualizerComponent, array: SortBarComponent[]): Promise<void> {
  const n: number = array.length;
  let max: number = 0;
  array.forEach(element  => {
    if (element.value > max) max = element.value;
  });
  let buckets: Array<SortBarComponent[]> = [];
  for (let i: number = 0; i < n; i++) {
    buckets.push([]);
  }
  array.forEach((element: SortBarComponent) => {
    buckets[Math.floor(n * element.value / max) - 1].push(element);
  });
  let totalCount: number = 0;
  for (let i: number = 0; i < buckets.length; i++) {
    for (let j: number = 0; j < buckets[i].length; j++) {
      array[totalCount] = buckets[i][j];
      array[totalCount].color = SortBarColor.SWAP;
      if (visualizer.enableAudio) visualizer.playBeep(3, array[totalCount].value, 50);
      visualizer.noOfCompares++;
      visualizer.noOfSwaps++;
      await visualizer.sleep(visualizer.sortDelay);
      array[totalCount].color = i % 2 ? SortBarColor.PIVOT : SortBarColor.NORMAL;
      totalCount++;
    }
  }
  totalCount = 0;
  for (let i: number = 0; i < buckets.length; i++) {
    buckets[i].sort((a: SortBarComponent, b: SortBarComponent) => {
      visualizer.noOfCompares++;
      return a.value - b.value;
    });
    visualizer.noOfSwaps = visualizer.noOfCompares;
    for (let j: number = 0, k: number = 0 + totalCount; j < buckets[i].length; j++, k++) {
      if (!visualizer.sorting) break;
      array[k] = buckets[i][j];
      array[k].color = SortBarColor.SWAP;
      if (visualizer.enableAudio) visualizer.playBeep(3, array[k].value, 50);
      await visualizer.sleep(visualizer.sortDelay);
      array[k].color = i % 2 ? SortBarColor.PIVOT : SortBarColor.NORMAL;
    }
    totalCount += buckets[i].length;
  }
  const finalArray: any[] = flatten(buckets);
  for (let i: number = 0; i < n; i++) {
    if (!visualizer.sorting) break;
    array[i] = finalArray[i];
    array[i].color = SortBarColor.SWAP;
    if (visualizer.enableAudio) visualizer.playBeep(3, array[i].value, 50);
    await visualizer.sleep(visualizer.sortDelay);
    array[i].color = SortBarColor.NORMAL;
  }
}

/*
function bucketSort(array, k) is
    buckets ← new array of k empty lists
    M ← the maximum key value in the array
    for i = 1 to length(array) do
        insert array[i] into buckets[floor(k × array[i] / M)]
    for i = 1 to k do 
        nextSort(buckets[i])
    return the concatenation of buckets[1], ...., buckets[k]
*/

/*
function bucketSort(arr,n)
{
    // 1) Create n empty buckets      
    let buckets = new Array(n);
    for (let i = 0; i < n; i++)
    {
        buckets[i] = [];
    }
    // 2) Put array elements in different buckets
    for (let i = 0; i < n; i++) {
        let idx = arr[i] * n;
        buckets[Math.floor(idx)].push(arr[i]);
    }

    // 3) Sort individual buckets
    for (let i = 0; i < n; i++) {
        buckets[i].sort(function(a,b){return a-b;});
    }

    // 4) Concatenate all buckets into arr[]
    let index = 0;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < buckets[i].length; j++) {
            arr[index++] = buckets[i][j];
        }
    }
}

*/