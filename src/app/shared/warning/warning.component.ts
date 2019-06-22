import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BrowserUtils} from '../../models/utils';
import {Warning} from '../../models/misc';

@Component({
  selector: 'app-warning',
  templateUrl: './warning.component.html',
  styleUrls: ['./warning.component.scss']
})
export class WarningComponent implements OnInit {
  private warn: Warning;

  @Input()
  set warning(w: Warning) {
    this.warn = w;
    this.visible = true;
    BrowserUtils.addBackdrop();
  }

  @Output()
  close = new EventEmitter<boolean>();

  public visible: boolean;

  constructor() {
    this.visible = true;
  }

  ngOnInit() {
  }

  cancel() {
    this.visible = false;
    BrowserUtils.removeBackdrop();
    this.close.emit(false);
  }

  ok() {
    this.visible = false;
    BrowserUtils.removeBackdrop();
    this.close.emit(true);
  }

}
