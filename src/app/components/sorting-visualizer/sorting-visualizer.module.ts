import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from './../../shared/shared.module';

import { SortingVisualizerComponent } from './sorting-visualizer.component';
import { IntroDialogComponent } from './intro-dialog/intro-dialog.component';
import { ComparisonDialogComponent } from './comparison-dialog/comparison-dialog.component';

@NgModule({
  declarations: [
    SortingVisualizerComponent,
    IntroDialogComponent,
    ComparisonDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    SharedModule
  ],
  exports: [
    SortingVisualizerComponent
  ]
})
export class SortingVisualizerModule {}