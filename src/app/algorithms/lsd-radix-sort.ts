import { SortingVisualizerComponent } from '../components/sorting-visualizer/sorting-visualizer.component';
import { SortBarColor, SortBarComponent } from './../shared/models/sort-bar/sort-bar.component';

/*
create 10 buckets (queues) for each digit (0 to 9)

for each digit placing

  for each element in list

    move element into respective bucket

  for each bucket, starting from smallest digit

    while bucket is non-empty

      restore element to list
*/

export async function lsdRadixSort(visualizer: SortingVisualizerComponent, array: SortBarComponent[]): Promise<void> {
  let buckets: Array<SortBarComponent[]> = [[],[],[],[],[],[],[],[],[],[]];
  let digitPlacing: number = 1;
  while (digitPlacing) {
    if (!visualizer.sorting) return;
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
      for (let j: number = buckets[i].length - 1; j >= 0; j--) {
        if (!visualizer.sorting) return;
        buckets[i][j].color = SortBarColor.SWAP;
        if (visualizer.enableAudio) visualizer.playBeep(3, buckets[i][j].value, 50);
        array.push(buckets[i][j]);
        await visualizer.sleep(visualizer.sortDelay);
        buckets[i][j].color = i % 2 ? SortBarColor.PIVOT : SortBarColor.NORMAL;
      }
    }
    if (digitTerminalCount === array.length) {
      break;
    }
    digitPlacing++;
    buckets = [[],[],[],[],[],[],[],[],[],[]];
  }
}