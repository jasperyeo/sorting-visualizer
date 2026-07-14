import { signal, WritableSignal } from '@angular/core';
import { SortingVisualizerComponent } from '../components/sorting-visualizer/sorting-visualizer.component';
import { SortBarColor, SortBarInterface } from '../shared/models/sort-bar/sort-bar.constants';
import { isSorted } from './common';

export async function thanosSort(visualizer: SortingVisualizerComponent, array: SortBarInterface[]): Promise<void> {
  const checkSorted: WritableSignal<boolean> = signal<boolean>(isSorted(visualizer, array));
  while (!checkSorted()) {
    if (!visualizer.isSorting()) return;
    const numberForSnap = Math.floor(array.length / 2);
    const elementsMarkedForSnap: WritableSignal<number> = signal<number>(0);
    while (elementsMarkedForSnap() < numberForSnap) {
      if (!visualizer.isSorting()) return;
      const randomIndex = Math.floor(Math.random() * array.length);
      if (array[randomIndex].color !== SortBarColor.SWAP) {
        array[randomIndex].color = SortBarColor.SWAP;
        if (visualizer.isAudioEnabled()) visualizer.playBeep(array[randomIndex].value);
        elementsMarkedForSnap.update(oriNum => oriNum + 1);
        visualizer.changeDetectorRef.markForCheck();
        await visualizer.sleep();
      }
    }
    for (let i: number = array.length - 1; i >= 0; i--) {
      if (array[i].color === SortBarColor.SWAP) {
        array.splice(i, 1);
      }
    }
    await visualizer.sleep();
    checkSorted.update(() => isSorted(visualizer, array));
  }
}