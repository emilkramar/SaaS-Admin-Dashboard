import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ThemeService } from '../../core/services/theme/theme.service';
import { ShellLayoutService } from '../shell-layout.service';
import { Header } from './header';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [ShellLayoutService, ThemeService],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show user name and notifications control', () => {
    fixture.detectChanges();
    const nameEl = fixture.debugElement.query(By.css('header span.text-sm.font-medium'));
    expect(nameEl.nativeElement.textContent).toContain('Alex Morgan');

    const notifyBtn = fixture.debugElement.query(
      By.css('button[aria-label^="Notifications"]'),
    );
    expect(notifyBtn).toBeTruthy();
    expect(notifyBtn.nativeElement.getAttribute('aria-label')).toContain('unread');

    const avatar = fixture.debugElement.query(
      By.css('header img[src="assets/images/avatar_placeholder.webp"]'),
    );
    expect(avatar).toBeTruthy();
  });
});
