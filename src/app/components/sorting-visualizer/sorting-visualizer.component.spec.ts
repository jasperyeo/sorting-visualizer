import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortingVisualizerComponent } from './sorting-visualizer.component';

describe('SortingVisualizerComponent', () => {
  let component: SortingVisualizerComponent;
  let fixture: ComponentFixture<SortingVisualizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SortingVisualizerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SortingVisualizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
