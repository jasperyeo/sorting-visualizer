import { SortingVisualizerComponent } from '../components/sorting-visualizer/sorting-visualizer.component';
import { SortBarColor, SortBarComponent } from '../shared/models/sort-bar/sort-bar.component';
import { flatten } from './common';

export async function pigeonholeSort(visualizer: SortingVisualizerComponent, array: SortBarComponent[]): Promise<void> {
  let pigeonhole: any[] = [];
  const arrayValues: number[] = array.map(element => element.value);
  for (let i: number = 0; i < arrayValues.length; i++) {
    if (!visualizer.sorting) return;
    visualizer.noOfCompares++;
    visualizer.noOfSwaps++;
    if (pigeonhole[arrayValues[i]]) {
      pigeonhole[arrayValues[i]].push(arrayValues[i]);
    } else {
      pigeonhole[arrayValues[i]] = [arrayValues[i]];
    }
    const finalArray: any[] = flatten(pigeonhole);
    for (let i: number = 0; i < array.length; i++) {
      if (!visualizer.sorting) return;
      if (finalArray[i] === undefined) {
        continue;
      }
      array[i].value = finalArray[i];
      array[i].color = SortBarColor.SWAP;
      if (visualizer.enableAudio) visualizer.playBeep(array[i].value);
      await visualizer.sleep(visualizer.sortDelay);
      array[i].color = SortBarColor.NORMAL;
    }
  };
  pigeonhole = pigeonhole.reduce((a, b) => a.concat(b), []);
  for (let i: number = 0; i < array.length; i++) {
    if (!visualizer.sorting) return;
    visualizer.noOfSwaps++;
    array[i].color = SortBarColor.SWAP;
    array[i].value = pigeonhole[i];
    if (visualizer.enableAudio) visualizer.playBeep(array[i].value);
    await visualizer.sleep(visualizer.sortDelay);
    array[i].color = SortBarColor.NORMAL;
  };
}