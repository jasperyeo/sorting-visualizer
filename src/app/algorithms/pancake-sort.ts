import { SortingVisualizerComponent } from '../components/sorting-visualizer/sorting-visualizer.component';
import { SortBarComponent } from './../shared/models/sort-bar/sort-bar.component';
import { compare, swap } from './common';

export async function pancakeSort(visualizer: SortingVisualizerComponent, array: SortBarComponent[]): Promise<void> {
  let pancakes: number = array.length;
  while (pancakes > 1) {
    if (!visualizer.sorting) return;
    let maxIndex: number = maxHeight(visualizer, array, pancakes);
    if (maxIndex !== pancakes) {
      await flip(visualizer, array, maxIndex);
      await flip(visualizer, array, pancakes - 1);
    }
    pancakes--;
  }
}

function maxHeight(visualizer: SortingVisualizerComponent, array: SortBarComponent[], maxHeightIndex: number): number {
  let heightIndex: number = 0;
  for (let i: number = 0; i < maxHeightIndex; i++) {
    if (compare(visualizer, array[i], array[heightIndex])) {
      heightIndex = i;
    }
  }
  return heightIndex;
}

async function flip(visualizer: SortingVisualizerComponent, array: SortBarComponent[], flipIndex: number): Promise<void> {
  let left: number = 0;
  while (left < flipIndex) {
    if (!visualizer.sorting) return;
    await swap(visualizer, array, left, flipIndex);
    flipIndex--;
    left++;
  }
}