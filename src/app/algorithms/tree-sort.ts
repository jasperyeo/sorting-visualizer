import { SortingVisualizerComponent } from '../components/sorting-visualizer/sorting-visualizer.component';
import { SortBarColor, SortBarComponent } from './../shared/models/sort-bar/sort-bar.component';
import { compare, swap } from './common';

class BinaryTree {
  public leftSubTree: BinaryTree | null = null;
  public node: SortBarComponent | null = null;
  public rightSubTree: BinaryTree | null = null;;
}

async function insert(visualizer: SortingVisualizerComponent, searchTree: BinaryTree, node: SortBarComponent, array: SortBarComponent[], left: boolean): Promise<void> {
  if (!visualizer.sorting) return;
  if (!searchTree.node) {
    searchTree.node = node;
    array.push(searchTree.node);
    if (visualizer.enableAudio) visualizer.playBeep(3, searchTree.node.value, 50);
    visualizer.noOfSwaps++;
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

async function inOrder(visualizer: SortingVisualizerComponent, searchTree: BinaryTree | null, array: SortBarComponent[]): Promise<void> {
  if (!visualizer.sorting) return;
  if (!searchTree || !searchTree.node) {
    return;
  } else {
    await inOrder(visualizer, searchTree.leftSubTree, array);
    if (visualizer.enableAudio) visualizer.playBeep(3, searchTree.node.value, 50);
    searchTree.node.color = SortBarColor.SWAP;
    array.push(searchTree.node);
    await visualizer.sleep(visualizer.sortDelay);
    searchTree.node.color = SortBarColor.NORMAL;
    await inOrder(visualizer, searchTree.rightSubTree, array);
  }
}

export async function treeSort(visualizer: SortingVisualizerComponent, array: SortBarComponent[]): Promise<void> {
  let searchTree: BinaryTree = new BinaryTree;
  let originalArray: SortBarComponent[] = JSON.parse(JSON.stringify(array));
  array.splice(0, array.length);
  for (let i: number = 0; i < originalArray.length; i++) {
    if (!visualizer.sorting) return;
    await insert(visualizer, searchTree, originalArray[i], array, false);
  }
  array.splice(0, array.length);
  await inOrder(visualizer, searchTree, array);
}