import { SortBarColor, SortBarInterface } from '../shared/models/sort-bar/sort-bar.constants';
import { SortingVisualizerComponent } from './../components/sorting-visualizer/sorting-visualizer.component';

export function compare(visualizer: SortingVisualizerComponent, i: SortBarInterface, j: SortBarInterface, includeEquals: boolean = false): boolean {
  visualizer.noOfCompares.update((value) => value + 1);
  return !includeEquals ? (i.value > j.value) : (i.value >= j.value);
}

export async function swap(visualizer: SortingVisualizerComponent, array: SortBarInterface[], i: number, j: number): Promise<void> {
  if (visualizer.isAudioEnabled()) visualizer.playBeep(array[i].value);
  if (visualizer.isAudioEnabled()) visualizer.playBeep(array[j].value);
  visualizer.noOfSwaps.update((value) => value + 1);
  array[i].color = SortBarColor.SWAP;
  array[j].color = SortBarColor.SWAP;
  [array[i], array[j]] = [array[j], array[i]];
  await visualizer.sleep();
  array[i].color = SortBarColor.NORMAL;
  array[j].color = SortBarColor.NORMAL;
}

export function flatten(array: any[]): any {
  return Array.isArray(array) ? [].concat(...array.map(flatten)) : array;
}

export function isSorted(visualizer: SortingVisualizerComponent, array: SortBarInterface[]): boolean {
  for (let i: number = 1; i < array.length; i++){
    if (compare(visualizer, array[i - 1], array[i])) {
      return false;
    }
  }
  return true;
}