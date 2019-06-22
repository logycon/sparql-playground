import { Component, Input } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { BrowserUtils } from 'src/app/models/utils';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent {
  private err: any;

  @Input()
  set error(val: any) {
    this.visible = true;
    this.err = val;
    BrowserUtils.addBackdrop();
  }
  get error(): any {
    return this.err;
  }

  public action: string;
  public visible: boolean;

  constructor() {
    this.visible = true;
    this.action = '';
  }

  public getErrorDetail() {
    console.log(this.error);
    if (this.error instanceof HttpErrorResponse) {
      return `${this.error.error.message || this.error.message}`;
    }
    return '';
  }

  hide() {
    this.visible = false;
    BrowserUtils.removeBackdrop();
  }

  copy() {
    if (BrowserUtils.copyToCliboard(this.getErrorDetail())) {
      this.action = '(COPIED)';
    } else {
      this.action = '(COPY FAILED)';
    }
  }

}
