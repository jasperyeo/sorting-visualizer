import { signal, WritableSignal } from '@angular/core';
import { SortingVisualizerComponent } from '../components/sorting-visualizer/sorting-visualizer.component';
import { SortBarColor, SortBarInterface } from '../shared/models/sort-bar/sort-bar.constants';

export async function countingSort(visualizer: SortingVisualizerComponent, array: SortBarInterface[]): Promise<void> {
  const min: number = Math.min(...array.map(elem => elem.value));
  const max: number = Math.max(...array.map(elem => elem.value));
  const originalLength: number = array.length;
  let count: WritableSignal<number[]> = signal<number[]>([]), counter: WritableSignal<number> = signal<number>(0);
  for (let i: number = 0; i <= max; i++) {
    if (!visualizer.isSorting()) return;
    count.update(prev => { prev[i] = 0; return prev; });
  }
  for (let i: number = 0; i < array.length; i++) {
    if (!visualizer.isSorting()) return;
    visualizer.noOfCompares.update((value) => value + 1);
    count.update(prev => { prev[array[i].value]++; return prev; });
  }
  array.splice(0);
  for (let i: number = 0; i < count.length; i++) {
    if (!visualizer.isSorting()) return;
    if (!count()[i]) continue;
    const hueValue: string = ((count()[i] * 100 / visualizer.maxValue) * 360).toString();
    let sortBar: SortBarInterface = {
      id: 'bar' + i.toString(), // id
      defaultColor: 'hsl(' + hueValue + ', 100%, 77%)', // defaultColor
      color: SortBarColor.NORMAL, // color
      style: visualizer.sortStyle, // style
      sortDelay: visualizer.sortDelay, // sortDelay
      value: count()[i] * 100, // value
      valueString: (count()[i] * 100).toString(), // valueString
      showValue: visualizer.isValuesShowed(), // showValue
      showGradientColor: visualizer.isGradientColorShowed() // showGradientColor
    };
    visualizer.noOfSwaps.update((value) => value + 1);
    array.push(sortBar);
    array[array.length - 1].color = SortBarColor.SWAP;
    await visualizer.sleep(visualizer.sortDelay);
    array[array.length - 1].color = SortBarColor.NORMAL;
  }
  if (array.length < originalLength) {
    const diff: number = originalLength - array.length;
    for (let i: number = 0; i < diff; i++) {
      let sortBar: SortBarInterface = {
        id: 'bar' + i.toString(), // id
        defaultColor: 'turquoise', // defaultColor
        color: SortBarColor.NORMAL, // color
        style: visualizer.sortStyle, // style
        sortDelay: visualizer.sortDelay, // sortDelay
        value: 0, // value
        valueString: '0', // valueString
        showValue: visualizer.isValuesShowed(), // showValue
        showGradientColor: visualizer.isGradientColorShowed() // showGradientColor
      };
      array.push(sortBar);
    }
  }
  for (let i: number = min; i <= max; i++) {
    if (!visualizer.isSorting()) return;
    while (count()[i]-- > 0) {
      if (!visualizer.isSorting()) return;
      visualizer.noOfSwaps.update((value) => value + 1);
      array[counter()].value = i;
      if (visualizer.isAudioEnabled()) visualizer.playBeep(array[counter()].value);
      const hueValue: string = ((array[counter()].value / visualizer.maxValue) * 360).toString();
      array[counter()].defaultColor = 'hsl(' + hueValue + ', 100%, 77%)';
      array[counter()].color = SortBarColor.SWAP;
      await visualizer.sleep(visualizer.sortDelay);
      array[counter()].color = SortBarColor.NORMAL;
      counter.update(() => counter() + 1);
    }
  }
}