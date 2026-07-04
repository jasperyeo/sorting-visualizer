import { SortingVisualizerComponent } from '../components/sorting-visualizer/sorting-visualizer.component';
import { SortBarColor, SortBarInterface } from '../shared/models/sort-bar/sort-bar.constants';
import { compare } from './common';

class BinaryTree {
  public leftSubTree: BinaryTree | null = null;
  public node: SortBarInterface | null = null;
  public rightSubTree: BinaryTree | null = null;;
}

async function insert(visualizer: SortingVisualizerComponent, searchTree: BinaryTree, node: SortBarInterface, array: SortBarInterface[], left: boolean): Promise<void> {
  if (!visualizer.isSorting()) return;
  if (!searchTree.node) {
    searchTree.node = node;
    array.push(searchTree.node);
    if (visualizer.isAudioEnabled()) visualizer.playBeep(searchTree.node.value);
    visualizer.noOfSwaps.update((value) => value + 1);
    searchTree.node.color = SortBarColor.SWAP;
    await visualizer.sleep(visualizer.sortDelay);
    searchTree.node.color = left ? SortBarColor.NORMAL : SortBarColor.PIVOT;
  } else {
    if (compare(visualizer, node, searchTree.node)) {
      searchTree.rightSubTree = searchTree.rightSubTree ? searchTree.rightSubTree : new BinaryTree;
      await insert(visualizer, searchTree.rightSubTree, node, array, false);
    } else {
      searchTree.leftSubTree = searchTree.leftSubTree ? searchTree.leftSubTree : new BinaryTree;
      await insert(visualizer, searchTree.leftSubTree, node, array, true);
    }
  }
}

async function inOrder(visualizer: SortingVisualizerComponent, searchTree: BinaryTree | null, array: SortBarInterface[]): Promise<void> {
  if (!visualizer.isSorting()) return;
  if (!searchTree || !searchTree.node) {
    return;
  } else {
    await inOrder(visualizer, searchTree.leftSubTree, array);
    if (visualizer.isAudioEnabled()) visualizer.playBeep(searchTree.node.value);
    searchTree.node.color = SortBarColor.SWAP;
    array.push(searchTree.node);
    await visualizer.sleep(visualizer.sortDelay);
    searchTree.node.color = SortBarColor.NORMAL;
    await inOrder(visualizer, searchTree.rightSubTree, array);
  }
}

export async function treeSort(visualizer: SortingVisualizerComponent, array: SortBarInterface[]): Promise<void> {
  let searchTree: BinaryTree = new BinaryTree;
  let originalArray: SortBarInterface[] = JSON.parse(JSON.stringify(array));
  array.splice(0, array.length);
  for (let i: number = 0; i < originalArray.length; i++) {
    if (!visualizer.isSorting()) return;
    await insert(visualizer, searchTree, originalArray[i], array, false);
  }
  array.splice(0, array.length);
  await inOrder(visualizer, searchTree, array);
}