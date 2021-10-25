import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { SharedModule } from './../../shared/shared.module';

import { SortingVisualizerComponent } from './sorting-visualizer.component';

@NgModule({
  declarations: [
    SortingVisualizerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule
  ],
  exports: [
    SortingVisualizerComponent
  ]
})
export class SortingVisualizerModule {}