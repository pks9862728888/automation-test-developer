import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerComponent } from './progress-spinner/progress-spinner.component';
import { ShowErrorComponent } from './show-error/show-error.component';
import { ConfirmDialog } from './dialogs/confirmation-dialog/confirm.dialog';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    ProgressSpinnerComponent,
    ShowErrorComponent,
    ConfirmDialog
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    HttpClientModule
  ],
  exports: [
    AngularMaterialModule,
    ProgressSpinnerComponent,
    ShowErrorComponent,
    ConfirmDialog
  ]
})
export class SharedModule { }
