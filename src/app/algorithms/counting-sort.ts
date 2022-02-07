import { SortingVisualizerComponent } from '../components/sorting-visualizer/sorting-visualizer.component';
import { SortBarColor, SortBarComponent } from './../shared/models/sort-bar/sort-bar.component';

export async function countingSort(visualizer: SortingVisualizerComponent, array: SortBarComponent[]): Promise<void> {
  const min: number = Math.min(...array.map(elem => elem.value));
  const max: number = Math.max(...array.map(elem => elem.value));
  let count: number[] = [], counter: number = 0, originalLength: number = array.length;
  for (let i: number = 0; i <= max; i++) {
    if (!visualizer.sorting) return;
    count[i] = 0;
  }
  for (let i: number = 0; i < array.length; i++) {
    if (!visualizer.sorting) return;
    visualizer.noOfCompares++;
    count[array[i].value]++;
  }
  array.splice(0);
  for (let i: number = 0; i < count.length; i++) {
    if (!visualizer.sorting) return;
    if (!count[i]) continue;
    let sortBar: SortBarComponent = new SortBarComponent;
    sortBar.id = 'bar' + i.toString();
    sortBar.style = visualizer.sortStyle;
    sortBar.sortDelay = visualizer.sortDelay;
    sortBar.value = count[i] * 100;
    const hueValue: string = ((sortBar.value / visualizer.maxValue) * 360).toString();
    sortBar.defaultColor = 'hsl(' + hueValue + ', 100%, 77%)';
    if (visualizer.enableAudio) visualizer.playBeep(sortBar.value);
    sortBar.showValue = visualizer.showValues;
    visualizer.noOfSwaps++;
    array.push(sortBar);
    array[array.length - 1].color = SortBarColor.SWAP;
    await visualizer.sleep(visualizer.sortDelay);
    array[array.length - 1].color = SortBarColor.NORMAL;
  }
  if (array.length < originalLength) {
    const diff: number = originalLength - array.length;
    for (let i: number = 0; i < diff; i++) {
      let sortBar: SortBarComponent = new SortBarComponent;
      sortBar.style = visualizer.sortStyle;
      sortBar.sortDelay = visualizer.sortDelay;
      sortBar.value = 0;
      array.push(sortBar);
    }
  }
  for (let i: number = min; i <= max; i++) {
    if (!visualizer.sorting) return;
    while (count[i]-- > 0) {
      if (!visualizer.sorting) return;
      visualizer.noOfSwaps++;
      array[counter].value = i;
      if (visualizer.enableAudio) visualizer.playBeep(array[counter].value);
      const hueValue: string = ((array[counter].value / visualizer.maxValue) * 360).toString();
      array[counter].defaultColor = 'hsl(' + hueValue + ', 100%, 77%)';
      array[counter].color = SortBarColor.SWAP;
      await visualizer.sleep(visualizer.sortDelay);
      array[counter].color = SortBarColor.NORMAL;
      counter++;
    }
  }
}