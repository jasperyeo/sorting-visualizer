import { Component, OnInit, Input } from '@angular/core';

import { SortBar } from './../../shared/models/sort-bar';

@Component({
  selector: 'sorting-visualizer',
  templateUrl: './sorting-visualizer.component.html',
  styleUrls: ['./sorting-visualizer.component.scss']
})
export class SortingVisualizerComponent implements OnInit {

  @Input('sortCount') public sortCount: number = 400;
  public sortArray: SortBar[] = [];

  constructor() { }

  public ngOnInit(): void {
    this.resetArray();
  }

  public resetArray(): void {
    this.sortArray.splice(0);
    for (let i: number = 0; i < this.sortCount; i++) {
      this.sortArray.push({ value: this._randomNumberFromRange(5, 800) });
    }
  }

  private _randomNumberFromRange(min: number, max: number) {
    return Math.floor(Math.random() * (max  - min + 1) + min);
  }

  public sort(array: SortBar[], mode: string) {
    switch (mode) {
      case 'quick': this.sortArray = this._quickSort(array); break;
    }
  }

  private _quickSort(array: SortBar[]): SortBar[] {
    if (array.length <= 1) {
      return array;
    }
    const pivot: SortBar = array[0];
    const left: SortBar[] = [], right: SortBar[] = [];
    for (let i: number = 1; i < array.length; i++) {
      array[i].value < pivot.value ? left.push(array[i]) : right.push(array[i]);
    }
    return this._quickSort(left).concat(pivot, this._quickSort(right));
  };
}
