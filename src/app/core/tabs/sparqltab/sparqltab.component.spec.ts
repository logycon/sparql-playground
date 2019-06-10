import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SparqlTabComponent } from './sparqltab.component';

describe('TabComponent', () => {
  let component: SparqlTabComponent;
  let fixture: ComponentFixture<SparqlTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SparqlTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SparqlTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
