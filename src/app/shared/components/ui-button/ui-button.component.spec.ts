import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiButtonComponent } from './ui-button.component';

describe('UiButtonComponent', () => {
  let fixture: ComponentFixture<UiButtonComponent>;
  let nativeEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiButtonComponent);
    nativeEl = fixture.nativeElement as HTMLElement;
  });

  it('should render the label text', () => {
    fixture.componentRef.setInput('label', 'Save changes');
    fixture.detectChanges();

    expect(nativeEl.textContent?.trim()).toBe('Save changes');
  });

  it('should apply primary variant class to the button', () => {
    fixture.componentRef.setInput('variant', 'primary');
    fixture.detectChanges();

    const btn = nativeEl.querySelector('button');
    expect(btn?.classList.contains('ui-button--primary')).toBe(true);
  });

  it('should apply secondary variant class to the button', () => {
    fixture.componentRef.setInput('variant', 'secondary');
    fixture.detectChanges();

    const btn = nativeEl.querySelector('button');
    expect(btn?.classList.contains('ui-button--secondary')).toBe(true);
  });

  it('should emit clicked when the button is pressed', () => {
    let clicks = 0;
    fixture.componentInstance.clicked.subscribe(() => {
      clicks += 1;
    });
    fixture.componentRef.setInput('label', 'Go');
    fixture.detectChanges();

    nativeEl.querySelector('button')?.click();

    expect(clicks).toBe(1);
  });
});
