import { signal, WritableSignal } from '@angular/core';
import { SortingVisualizerComponent } from '../components/sorting-visualizer/sorting-visualizer.component';
import { SortBarColor, SortBarInterface } from '../shared/models/sort-bar/sort-bar.constants';
import { flatten } from './common';

export async function pigeonholeSort(visualizer: SortingVisualizerComponent, array: SortBarInterface[]): Promise<void> {
  let pigeonhole: WritableSignal<any[]> = signal<any[]>([]);
  const arrayValues: number[] = array.map(element => element.value);
  for (let i: number = 0; i < arrayValues.length; i++) {
    if (!visualizer.isSorting()) return;
    visualizer.noOfCompares.update((value) => value + 1);
    visualizer.noOfSwaps.update((value) => value + 1);
    if (pigeonhole()[arrayValues[i]]) {
      pigeonhole.update(prev => {
        prev[arrayValues[i]].push(arrayValues[i]);
        return prev;
      });
    } else {
      pigeonhole.update(prev => {
        prev[arrayValues[i]] = [arrayValues[i]];
        return prev;
      });
    }
    const finalArray: any[] = flatten(pigeonhole());
    for (let i: number = 0; i < array.length; i++) {
      if (!visualizer.isSorting()) return;
      if (finalArray[i] === undefined) {
        continue;
      }
      array[i].value = finalArray[i];
      array[i].color = SortBarColor.SWAP;
      if (visualizer.isAudioEnabled()) visualizer.playBeep(array[i].value);
      await visualizer.sleep();
      array[i].color = SortBarColor.NORMAL;
    }
  };
  pigeonhole.update(prev => prev.reduce((a, b) => a.concat(b), []));
  for (let i: number = 0; i < array.length; i++) {
    if (!visualizer.isSorting()) return;
    visualizer.noOfSwaps.update((value) => value + 1);
    array[i].color = SortBarColor.SWAP;
    array[i].value = pigeonhole()[i];
    if (visualizer.isAudioEnabled()) visualizer.playBeep(array[i].value);
    await visualizer.sleep();
    array[i].color = SortBarColor.NORMAL;
  };
}