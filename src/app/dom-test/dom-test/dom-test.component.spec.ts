import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DomTestComponent } from './dom-test.component';

describe('DomTestComponent', () => {
  let component: DomTestComponent;
  let fixture: ComponentFixture<DomTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DomTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DomTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
