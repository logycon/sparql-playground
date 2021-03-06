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
    console.log('setError', val);
    this.visible = true;
    this.err = val;
    BrowserUtils.addBackdrop();
  }
  get error(): any {
    return this.err;
  }

  public visible: boolean;
  public action: string;

  constructor() {
    this.visible = true;
    this.action = '';
  }

  public getErrorDetail() {
    const msg = (this.error.error.message) ? this.error.error.message : this.error.message;
    return `${msg}`;
  }

  hide() {
    this.visible = false;
    BrowserUtils.removeBackdrop();
  }

  copy() {
    if (BrowserUtils.copyToClipboard(this.getErrorDetail())) {
      this.action = '(COPIED)';
    } else {
      this.action = '(COPY FAILED)';
    }
  }

}
