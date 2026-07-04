import { signal, WritableSignal } from '@angular/core';
import { SortingVisualizerComponent } from '../components/sorting-visualizer/sorting-visualizer.component';
import { SortBarColor, SortBarInterface } from '../shared/models/sort-bar/sort-bar.constants';
import { compare } from './common';

export async function cycleSort(visualizer: SortingVisualizerComponent, array: SortBarInterface[]): Promise<void> {
  const n: number = array.length;
  let writes: WritableSignal<number> = signal<number>(0);
  for (let start: number = 0; start <= n - 2; start++)
  {
    if (!visualizer.isSorting()) return;
    let item: WritableSignal<SortBarInterface> = signal<SortBarInterface>(array[start]);
    let pos: WritableSignal<number> = signal<number>(start);
    for (let i: number = start + 1; i < n; i++) {
      if (!visualizer.isSorting()) return;
      if (compare(visualizer, item(), array[i])) {
        pos.update(() => pos() + 1);
        array[pos()].color = SortBarColor.PIVOT;
        await visualizer.sleep(0);
        array[pos()].color = SortBarColor.NORMAL;
      }
    }
    if (pos() === start) {
      continue;
    }
    while (item().value === array[pos()].value) {
      if (!visualizer.isSorting()) return;
      pos.update(() => pos() + 1);
      array[pos()].color = SortBarColor.PIVOT;
      await visualizer.sleep(0);
      array[pos()].color = SortBarColor.NORMAL;
    }
    if (pos() !== start) {
      let temp: SortBarInterface = item();
      item.update(() => array[pos()]);
      array[pos()] = temp;
      array[pos()].color = SortBarColor.SWAP;
      if (visualizer.isAudioEnabled()) visualizer.playBeep(item().value);
      if (visualizer.isAudioEnabled()) visualizer.playBeep(array[pos()].value);
      visualizer.noOfSwaps.update((value) => value + 1);
      writes.update(() => writes() + 1);
      visualizer.sortStats.update((stats) => {
        let currentWrites: number = parseInt(stats[0].value);
        stats[0].value = (++currentWrites).toString();
        return stats;
      });
      await visualizer.sleep(visualizer.sortDelay);
      array[pos()].color = SortBarColor.NORMAL;
    }
    while (pos() !== start)
    {
      if (!visualizer.isSorting()) return;
      pos.update(() => start);
      for (let i: number = start + 1; i < n; i++) {
        if (!visualizer.isSorting()) return;
        if (compare(visualizer, item(), array[i])) {
          pos.update(() => pos() + 1);
          array[pos()].color = SortBarColor.PIVOT;
          await visualizer.sleep(0);
          array[pos()].color = SortBarColor.NORMAL;
        }
      }
      while (item().value === array[pos()].value) {
        if (!visualizer.isSorting()) return;
        pos.update(() => pos() + 1);
        array[pos()].color = SortBarColor.PIVOT;
        await visualizer.sleep(0);
        array[pos()].color = SortBarColor.NORMAL;
      }
      if (item() !== array[pos()]) {
        let temp: SortBarInterface = item();
        item.update(() => array[pos()]);
        array[pos()] = temp;
        array[pos()].color = SortBarColor.SWAP;
        if (visualizer.isAudioEnabled()) visualizer.playBeep(item().value);
        if (visualizer.isAudioEnabled()) visualizer.playBeep(array[pos()].value);
        visualizer.noOfSwaps.update((value) => value + 1);
        writes.update(() => writes() + 1);
        visualizer.sortStats.update((stats) => {
          let currentWrites: number = parseInt(stats[0].value);
          stats[0].value = (++currentWrites).toString();
          return stats;
        });
        await visualizer.sleep(visualizer.sortDelay);
        array[pos()].color = SortBarColor.NORMAL;
      }
    }
  }
}