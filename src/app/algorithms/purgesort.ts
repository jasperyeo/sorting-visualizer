import { signal, WritableSignal } from '@angular/core';
import { SortingVisualizerComponent } from '../components/sorting-visualizer/sorting-visualizer.component';
import { SortBarColor, SortBarInterface } from '../shared/models/sort-bar/sort-bar.constants';
import { compare, isSorted } from './common';

export async function purgeSort(visualizer: SortingVisualizerComponent, array: SortBarInterface[]): Promise<void> {
  const checkSorted: WritableSignal<boolean> = signal<boolean>(isSorted(visualizer, array));
  while (!checkSorted()) {
    if (!visualizer.isSorting()) return;
    const indexForPurge: WritableSignal<number> = signal<number>(0);
    for (let i: number = 1; i < array.length; i++) {
      if (!visualizer.isSorting()) return;
      if (visualizer.isAudioEnabled()) visualizer.playBeep(array[i].value);
      array[i].color = SortBarColor.PIVOT;
      await visualizer.sleep();
      if (compare(visualizer, array[i - 1], array[i])) {
        if (visualizer.isAudioEnabled()) visualizer.playBeep(array[i].value);
        array[i].color = SortBarColor.SWAP;
        indexForPurge.update(() => i);
        await visualizer.sleep();
        visualizer.sortStats.update((stats) => {
          const currentPurges: number = parseInt(stats[0].value);
          stats[0].value = (currentPurges + 1).toString();
          return stats;
        });
        break;
      } else {
        array[i].color = SortBarColor.NORMAL;
      }
    }
    array.splice(indexForPurge(), 1);
    await visualizer.sleep();
    checkSorted.update(() => isSorted(visualizer, array));
  }
}