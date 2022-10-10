import { SortingVisualizerComponent } from '../components/sorting-visualizer/sorting-visualizer.component';
import { SortBarColor, SortBarComponent } from '../shared/models/sort-bar/sort-bar.component';

async function resize(array: number[], newSize: number, defaultValue: number) {
  while (newSize > array.length) {
    array.push(defaultValue);
  }
  array.length = newSize;
}

async function distribute(visualizer: SortingVisualizerComponent, dist: number, list: number[]) {
  if (dist > list.length) {
    visualizer.noOfCompares++;
    resize(list, dist, 0);
  }
  for (let i: number = 0; i < dist; i++) {
    list[i]++;
  }
}

export async function beadSort(visualizer: SortingVisualizerComponent, array: SortBarComponent[]): Promise<void> {
  let beadList: number[] = [], finalList: number[] = [], originalList: number[] = array.map(element => element.value);
  // beads falling down
  for (let i: number = 0; i < originalList.length; i++) {
    if (!visualizer.sorting) return;
    distribute(visualizer, originalList[i], beadList);
    for (let i: number = 0; i < array.length; i++) {
      if (!visualizer.sorting) return;
      if (beadList[i]) {
        array[i].value = beadList[i];
        visualizer.noOfSwaps++;
        array[i].color = SortBarColor.SWAP;
        if (visualizer.enableAudio) visualizer.playBeep(array[i].value);
        await visualizer.sleep(visualizer.sortDelay);
        array[i].color = SortBarColor.NORMAL;
      }
    }
  }
  // beads right side up
  for (let i: number = 0; i < beadList.length; i++) {
    if (!visualizer.sorting) return;
    distribute(visualizer, beadList[i], finalList);
  }
  for (let i: number = 0; i < finalList.length; i++) {
    if (!visualizer.sorting) return;
    array[i].value = finalList[finalList.length - 1 - i];
    visualizer.noOfSwaps++;
    array[i].color = SortBarColor.SWAP;
    if (visualizer.enableAudio) visualizer.playBeep(array[i].value);
    await visualizer.sleep(visualizer.sortDelay);
    array[i].color = SortBarColor.NORMAL;
  }
}