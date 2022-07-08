import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerComponent } from './progress-spinner/progress-spinner.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ShowErrorComponent } from './show-error/show-error.component';

@NgModule({
  declarations: [
    ProgressSpinnerComponent,
    ShowErrorComponent
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule
  ],
  exports: [
    ProgressSpinnerComponent,
    ShowErrorComponent
  ]
})
export class SharedModule { }
