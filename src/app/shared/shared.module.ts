import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortBarComponent } from './models/sort-bar/sort-bar.component';

@NgModule({
  declarations: [
    SortBarComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SortBarComponent
  ]
})
export class SharedModule { }
