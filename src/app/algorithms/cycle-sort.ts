import { SortingVisualizerComponent } from '../components/sorting-visualizer/sorting-visualizer.component';
import { SortBarColor, SortBarComponent } from './../shared/models/sort-bar/sort-bar.component';
import { compare } from './common';

export async function cycleSort(visualizer: SortingVisualizerComponent, array: SortBarComponent[]): Promise<void> {
  let writes: number = 0, n: number = array.length;
  for (let start: number = 0; start <= n - 2; start++)
  {
    if (!visualizer.sorting) return;
    let item: SortBarComponent = array[start];
    let pos: number = start;
    for (let i: number = start + 1; i < n; i++) {
      if (!visualizer.sorting) return;
      if (compare(visualizer, item, array[i])) {
        pos++;
        array[pos].color = SortBarColor.PIVOT;
        //await visualizer.sleep(0);
        array[pos].color = SortBarColor.NORMAL;
      }
    }
    if (pos === start) {
      continue;
    }
    while (item.value === array[pos].value) {
      if (!visualizer.sorting) return;
      pos++;
      array[pos].color = SortBarColor.PIVOT;
      //await visualizer.sleep(0);
      array[pos].color = SortBarColor.NORMAL;
    }
    if (pos !== start) {
      let temp: SortBarComponent = item;
      item = array[pos];
      array[pos] = temp;
      array[pos].color = SortBarColor.SWAP;
      if (visualizer.enableAudio) visualizer.playBeep(item.value);
      if (visualizer.enableAudio) visualizer.playBeep(array[pos].value);
      visualizer.noOfSwaps++;
      writes++;
      await visualizer.sleep(visualizer.sortDelay);
      array[pos].color = SortBarColor.NORMAL;
    }
    while (pos !== start)
    {
      if (!visualizer.sorting) return;
      pos = start;
      for (let i: number = start + 1; i < n; i++) {
        if (!visualizer.sorting) return;
        if (compare(visualizer, item, array[i])) {
          pos++;
          array[pos].color = SortBarColor.PIVOT;
          //await visualizer.sleep(0);
          array[pos].color = SortBarColor.NORMAL;
        }
      }
      while (item.value === array[pos].value) {
        if (!visualizer.sorting) return;
        pos++;
        array[pos].color = SortBarColor.PIVOT;
        //await visualizer.sleep(0);
        array[pos].color = SortBarColor.NORMAL;
      }
      if (item !== array[pos]) {
        let temp: SortBarComponent = item;
        item = array[pos];
        array[pos] = temp;
        array[pos].color = SortBarColor.SWAP;
        if (visualizer.enableAudio) visualizer.playBeep(item.value);
        if (visualizer.enableAudio) visualizer.playBeep(array[pos].value);
        visualizer.noOfSwaps++;
        writes++;
        await visualizer.sleep(visualizer.sortDelay);
        array[pos].color = SortBarColor.NORMAL;
      }
    }
  }
}