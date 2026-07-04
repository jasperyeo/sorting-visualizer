import { signal, WritableSignal } from '@angular/core';
import { SortingVisualizerComponent } from '../components/sorting-visualizer/sorting-visualizer.component';
import { SortBarColor, SortBarInterface } from '../shared/models/sort-bar/sort-bar.constants';

export async function lsdRadixSort(visualizer: SortingVisualizerComponent, array: SortBarInterface[]): Promise<void> {
  let digitPlacing: WritableSignal<number> = signal<number>(1);
  while (digitPlacing()) {
    if (!visualizer.isSorting()) return;
    let buckets: Array<SortBarInterface[]> = [[],[],[],[],[],[],[],[],[],[]];
    let digitTerminalCount: number = 0;
    for (let i: number = array.length - 1; i >= 0; i--) {
      if (!visualizer.isSorting()) return;
      const stringValue: string = array[i].value.toString();
      const digitChar: string = stringValue.charAt(stringValue.length - digitPlacing());
      if (digitChar && digitChar.length) {
        const digitValue: number = parseInt(digitChar);
        buckets[digitValue].push(array.splice(i, 1)[0]);
      } else {
        digitTerminalCount++;
        buckets[0].push(array.splice(i, 1)[0]);
      }
    }
    for (let i: number = 0; i < buckets.length; i++) {
      if (!visualizer.isSorting()) return;
      while (buckets[i].length) {
        let popped: SortBarInterface = buckets[i].pop() as SortBarInterface;
        if (!visualizer.isSorting()) return;
        popped.color = SortBarColor.SWAP;
        if (visualizer.isAudioEnabled()) visualizer.playBeep(popped.value);
        array.push(popped);
        visualizer.noOfCompares.update((value) => value + 1);
        visualizer.noOfSwaps.update((value) => value + 1);
        await visualizer.sleep(visualizer.sortDelay);
        popped.color = i % 2 ? SortBarColor.PIVOT : SortBarColor.NORMAL;
      }
    }
    if (digitTerminalCount === array.length) {
      break;
    }
    digitPlacing.update(() => digitPlacing() + 1);
  }
}