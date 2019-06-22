import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorComponent } from './error/error.component';
import { WarningComponent } from './warning/warning.component';

@NgModule({
  declarations: [ErrorComponent, WarningComponent],
  imports: [
    CommonModule
  ],
  exports: [ErrorComponent, WarningComponent]
})
export class SharedModule { }
