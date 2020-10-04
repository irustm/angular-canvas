import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphCanvasExampleComponent } from './graph-canvas-example.component';

describe('CanvasExampleComponent', () => {
  let component: GraphCanvasExampleComponent;
  let fixture: ComponentFixture<GraphCanvasExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphCanvasExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphCanvasExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
