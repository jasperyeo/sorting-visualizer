import { signal, WritableSignal } from '@angular/core';
import { SortingVisualizerComponent } from '../components/sorting-visualizer/sorting-visualizer.component';
import { SortBarColor, SortBarInterface } from '../shared/models/sort-bar/sort-bar.constants';

export async function tournamentSort(visualizer: SortingVisualizerComponent, array: SortBarInterface[]): Promise<void> {
  if (array.length <= 1) return;
  const n: number = array.length;
  const treesize: WritableSignal<number> = signal<number>(1);
  while (treesize() < n) {
    if (!visualizer.isSorting()) return;
    treesize.update(origSize => origSize * 2);
  }
  const tree: { node: SortBarInterface | null, index: number }[] = new Array(2 * treesize() - 1);
  const leafStartIndex: number = treesize() - 1;
  for (let i: number = 0; i < treesize(); i++) {
    if (!visualizer.isSorting()) return;
    tree[leafStartIndex + i] = { node: (i < n ? array[i] : null), index: leafStartIndex + i };
  }
  array.splice(0, array.length);
  for (let i: number = leafStartIndex - 1; i >= 0; i--) {
    if (!visualizer.isSorting()) return;
    const leftChild = tree[2 * i + 1];
    const rightChild = tree[2 * i + 2];
    tree[i] = rightChild.node === null ||
      (leftChild.node && leftChild.node?.value <= rightChild.node?.value) ?
      leftChild : rightChild;
    visualizer.noOfCompares.update(value => value + 1);
    tree[i].node!.color = SortBarColor.SWAP;
    if (visualizer.isAudioEnabled()) visualizer.playBeep(tree[i].node!.value);
    array.push(tree[i].node!);
    visualizer.noOfSwaps.update(value => value + 1);
    await visualizer.sleep();
    tree[i].node!.color = SortBarColor.NORMAL;
  }
  array.splice(0, array.length);
  for (let i: number = 0; i < n; i++) {
    if (!visualizer.isSorting()) return;
    const winner = tree[0];
    winner.node!.color = SortBarColor.SWAP;
    if (visualizer.isAudioEnabled()) visualizer.playBeep(winner.node!.value);
    array.push(winner.node!);
    visualizer.noOfSwaps.update(value => value + 1);
    await visualizer.sleep();
    winner.node!.color = SortBarColor.NORMAL;
    const currentIndex: WritableSignal<number> = signal<number>(winner.index);
    tree[currentIndex()] = { node: null, index: currentIndex() };
    while (currentIndex() > 0) {
      if (!visualizer.isSorting()) return;
      const parentIndex: number = Math.floor((currentIndex() - 1) / 2);
      const leftIndex: number = 2 * parentIndex + 1;
      const rightIndex: number = 2 * parentIndex + 2;
      tree[parentIndex] = tree[rightIndex].node === null ||
        (tree[leftIndex].node && tree[leftIndex].node?.value <= tree[rightIndex].node?.value) ?
        tree[leftIndex] : tree[rightIndex];
      visualizer.noOfCompares.update(value => value + 1);
      currentIndex.update(() => parentIndex);
    }
  }
}