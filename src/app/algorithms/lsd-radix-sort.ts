import { SortingVisualizerComponent } from '../components/sorting-visualizer/sorting-visualizer.component';
import { SortBarColor, SortBarComponent } from './../shared/models/sort-bar/sort-bar.component';

export async function lsdRadixSort(visualizer: SortingVisualizerComponent, array: SortBarComponent[]): Promise<void> {
  let digitPlacing: number = 1;
  while (digitPlacing) {
    if (!visualizer.sorting) return;
    let buckets: Array<SortBarComponent[]> = [[],[],[],[],[],[],[],[],[],[]];
    let digitTerminalCount: number = 0;
    for (let i: number = array.length - 1; i >= 0; i--) {
      if (!visualizer.sorting) return;
      const stringValue: string = array[i].value.toString();
      const digitChar: string = stringValue.charAt(stringValue.length - digitPlacing);
      if (digitChar && digitChar.length) {
        const digitValue: number = parseInt(digitChar);
        buckets[digitValue].push(array.splice(i, 1)[0]);
      } else {
        digitTerminalCount++;
        buckets[0].push(array.splice(i, 1)[0]);
      }
    }
    for (let i: number = 0; i < buckets.length; i++) {
      if (!visualizer.sorting) return;
      while (buckets[i].length) {
        let popped: SortBarComponent = buckets[i].pop() as SortBarComponent;
        if (!visualizer.sorting) return;
        popped.color = SortBarColor.SWAP;
        if (visualizer.enableAudio) visualizer.playBeep(3, popped.value, 50);
        array.push(popped);
        visualizer.noOfCompares++;
        visualizer.noOfSwaps++;
        await visualizer.sleep(visualizer.sortDelay);
        popped.color = i % 2 ? SortBarColor.PIVOT : SortBarColor.NORMAL;
      }
    }
    if (digitTerminalCount === array.length) {
      break;
    }
    digitPlacing++;
  }
}