import { SortingVisualizerComponent } from '../components/sorting-visualizer/sorting-visualizer.component';
import { SortBarColor, SortBarComponent } from './../shared/models/sort-bar/sort-bar.component';
import { compare, swap } from './common';

enum PivotCode {
  LEFT = 0,
  MIDDLE = 1,
  MEDIAN = 2
}

export async function leftPivotQuickSort(visualizer: SortingVisualizerComponent, array: SortBarComponent[]): Promise<void> {
  await quickSortRecursive(PivotCode.LEFT, visualizer, array, 0, array.length - 1);
}

export async function middlePivotQuickSort(visualizer: SortingVisualizerComponent, array: SortBarComponent[]): Promise<void> {
  await quickSortRecursive(PivotCode.MIDDLE, visualizer, array, 0, array.length - 1);
}

export async function medianPivotQuickSort(visualizer: SortingVisualizerComponent, array: SortBarComponent[]): Promise<void> {
  await quickSortRecursive(PivotCode.MEDIAN, visualizer, array, 0, array.length - 1);
}

async function partition(pivotCode: PivotCode, visualizer: SortingVisualizerComponent, array: SortBarComponent[], left: number, right: number): Promise<number> {
  let pivot: number;
  if (pivotCode === PivotCode.LEFT) {
    pivot = left;
  } else if (pivotCode === PivotCode.MIDDLE) {
    pivot = Math.floor((right + left) / 2);
  } else {
   const mid: number = Math.floor((right + left) / 2);
   if (compare(visualizer, array[left], array[mid])) {
    await swap(visualizer, array, left, mid);
   }
   if (compare(visualizer, array[left], array[right])) {
    await swap(visualizer, array, left, right);
   }
   if (compare(visualizer, array[right], array[mid])) {
    await swap(visualizer, array, right, mid);
   }
   pivot = right;
  }
  const pivotValue: number = array[pivot].value;
  let i: number = left, j: number = right;
  while (i <= j) {
    array[pivot].color = SortBarColor.PIVOT;
    while (array[i].value < pivotValue) {
      visualizer.noOfCompares++;
      i++;
    }
    while (array[j].value > pivotValue) {
      visualizer.noOfCompares++;
      j--;
    }
    if (i <= j) {
      await swap(visualizer, array, i, j);
      i++; j--;
    }
  }
  array[pivot].color = SortBarColor.NORMAL;
  return i;
}

async function quickSortRecursive(pivotCode: PivotCode, visualizer: SortingVisualizerComponent, array: SortBarComponent[], left: number, right: number): Promise<void> {
  if (array.length > 1) {
    const index: number = await partition(pivotCode, visualizer, array, left, right);
    if (left < index - 1) {
      await quickSortRecursive(pivotCode, visualizer, array, left, index - 1);
    }
    if (index < right) {
      await quickSortRecursive(pivotCode, visualizer, array, index, right);
    }
  }
}