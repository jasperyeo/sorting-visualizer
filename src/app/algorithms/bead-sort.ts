import { SortingVisualizerComponent } from '../components/sorting-visualizer/sorting-visualizer.component';
import { SortBarColor, SortBarInterface } from '../shared/models/sort-bar/sort-bar.constants';

async function resize(array: number[], newSize: number, defaultValue: number) {
  while (newSize > array.length) {
    array.push(defaultValue);
  }
  array.length = newSize;
}

async function distribute(visualizer: SortingVisualizerComponent, dist: number, list: number[]) {
  if (dist > list.length) {
    visualizer.noOfCompares.update((value) => value + 1);
    resize(list, dist, 0);
  }
  for (let i: number = 0; i < dist; i++) {
    list[i]++;
  }
}

export async function beadSort(visualizer: SortingVisualizerComponent, array: SortBarInterface[]): Promise<void> {
  let beadList: number[] = [], finalList: number[] = [], originalList: number[] = array.map(element => element.value);
  // beads falling down
  for (let i: number = 0; i < originalList.length; i++) {
    if (!visualizer.isSorting()) return;
    distribute(visualizer, originalList[i], beadList);
    for (let i: number = 0; i < array.length; i++) {
      if (!visualizer.isSorting()) return;
      if (beadList[i]) {
        array[i].value = beadList[i];
        visualizer.noOfSwaps.update((value) => value + 1);
        array[i].color = SortBarColor.SWAP;
        if (visualizer.isAudioEnabled()) visualizer.playBeep(array[i].value);
        await visualizer.sleep(visualizer.sortDelay);
        array[i].color = SortBarColor.NORMAL;
      }
    }
  }
  // beads right side up
  for (let i: number = 0; i < beadList.length; i++) {
    if (!visualizer.isSorting()) return;
    distribute(visualizer, beadList[i], finalList);
  }
  for (let i: number = 0; i < finalList.length; i++) {
    if (!visualizer.isSorting()) return;
    array[i].value = finalList[finalList.length - 1 - i];
    visualizer.noOfSwaps.update((value) => value + 1);
    array[i].color = SortBarColor.SWAP;
    if (visualizer.isAudioEnabled()) visualizer.playBeep(array[i].value);
    await visualizer.sleep(visualizer.sortDelay);
    array[i].color = SortBarColor.NORMAL;
  }
}