import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SortBarComponent } from './models/sort-bar/sort-bar.component';
import { BigONotationPipe } from './pipes/big-o-notation.pipe';

@NgModule({
  declarations: [
    SortBarComponent,
    BigONotationPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SortBarComponent,
    BigONotationPipe
  ]
})
export class SharedModule { }
