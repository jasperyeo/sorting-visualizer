import { SortingVisualizerComponent } from './../components/sorting-visualizer/sorting-visualizer.component';
import { SortBarColor, SortBarComponent } from './../shared/models/sort-bar/sort-bar.component';

export function compare(visualizer: SortingVisualizerComponent, i: SortBarComponent, j: SortBarComponent, includeEquals: boolean = false): boolean {
  visualizer.noOfCompares++;
  return !includeEquals ? (i.value > j.value) : (i.value >= j.value);
}

export async function swap(visualizer: SortingVisualizerComponent, array: SortBarComponent[], i: number, j: number): Promise<void> {
  if (visualizer.enableAudio) visualizer.playBeep(array[i].value);
  if (visualizer.enableAudio) visualizer.playBeep(array[j].value);
  visualizer.noOfSwaps++;
  array[i].color = array[j].color = SortBarColor.SWAP;
  [array[i], array[j]] = [array[j], array[i]];
  await visualizer.sleep(visualizer.sortDelay);
  array[i].color = array[j].color = SortBarColor.NORMAL;
}

export function flatten(array: any[]): any {
  return Array.isArray(array) ? [].concat(...array.map(flatten)) : array;
}