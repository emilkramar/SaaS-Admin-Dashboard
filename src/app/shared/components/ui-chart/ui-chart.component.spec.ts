import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiChartComponent } from './ui-chart.component';

describe('UiChartComponent', () => {
  let fixture: ComponentFixture<UiChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiChartComponent);
    fixture.componentRef.setInput('labels', ['A', 'B']);
    fixture.componentRef.setInput('values', [1, 2]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
