import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiBadgeComponent } from './ui-badge.component';

describe('UiBadgeComponent', () => {
  let fixture: ComponentFixture<UiBadgeComponent>;
  let nativeEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiBadgeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiBadgeComponent);
    nativeEl = fixture.nativeElement as HTMLElement;
  });

  it('should render value text', () => {
    fixture.componentRef.setInput('value', 'Active');
    fixture.detectChanges();

    expect(nativeEl.textContent?.trim()).toBe('Active');
  });

  it('should apply success (green) classes when color is success — e.g. status Active', () => {
    fixture.componentRef.setInput('value', 'Active');
    fixture.componentRef.setInput('color', 'success');
    fixture.detectChanges();

    const span = nativeEl.querySelector('span');
    expect(span?.className).toContain('text-success');
    expect(span?.className).toContain('bg-success-muted');
  });

  it('should apply warning (yellow) classes when color is warning — e.g. status Pending', () => {
    fixture.componentRef.setInput('value', 'Pending');
    fixture.componentRef.setInput('color', 'warning');
    fixture.detectChanges();

    const span = nativeEl.querySelector('span');
    expect(span?.className).toContain('text-warning');
    expect(span?.className).toContain('bg-warning-muted');
  });
});
