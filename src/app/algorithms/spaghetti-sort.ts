import { SortingVisualizerComponent } from '../components/sorting-visualizer/sorting-visualizer.component';
import { SortBarColor, SortBarInterface } from '../shared/models/sort-bar/sort-bar.constants';

export async function spaghettiSort(visualizer: SortingVisualizerComponent, array: SortBarInterface[]): Promise<void> {
  if (array.length <= 1) return;
  const maxValue: number = Math.max(...array.map(element => element.value));
  const poles: SortBarInterface[][] = Array.from({ length: maxValue + 1 }, () => []);
  for (let i = array.length - 1; i >- 0; i--) {
    if (!visualizer.isSorting()) return;
    array[i].color = SortBarColor.SWAP;
    if (visualizer.isAudioEnabled()) visualizer.playBeep(array[i].value);
    visualizer.noOfCompares.update(value => value + 1);
    poles[array[i].value].push(array[i]);
    await visualizer.sleep();
    array[i].color = SortBarColor.NORMAL;
    array.splice(i, 1);
  }
  array.splice(0, array.length);
  for (let length: number = maxValue; length >= 0; length--) {
    if (!visualizer.isSorting()) return;
    while (poles[length].length > 0) {
      if (!visualizer.isSorting()) return;
      const currentBar: SortBarInterface = poles[length].pop()!;
      currentBar.color = SortBarColor.SWAP;
      array.unshift(currentBar);
      visualizer.noOfSwaps.update(value => value + 1);
      if (visualizer.isAudioEnabled()) visualizer.playBeep(currentBar.value);
      await visualizer.sleep();
      currentBar.color = SortBarColor.NORMAL;
    }
  }
}