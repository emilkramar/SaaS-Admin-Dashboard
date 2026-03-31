import { ComponentFixture, TestBed } from '@angular/core/testing';

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
});
