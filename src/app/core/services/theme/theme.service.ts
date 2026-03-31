import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  inject,
  Injectable,
  PLATFORM_ID,
  signal,
} from '@angular/core';

const STORAGE_KEY = 'saas-admin-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private doc = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);

  isDark = signal(false);

  init(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const stored = localStorage.getItem(STORAGE_KEY);
    let dark: boolean;
    if (stored === 'dark') dark = true;
    else if (stored === 'light') dark = false;
    else {
      dark =
        typeof matchMedia !== 'undefined' &&
        matchMedia('(prefers-color-scheme: dark)').matches;
    }
    this.applyDarkClass(dark);
    this.isDark.set(dark);
  }

  toggle(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const next = !this.isDark();
    this.applyDarkClass(next);
    this.isDark.set(next);
    localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light');
  }

  private applyDarkClass(dark: boolean): void {
    this.doc.documentElement.classList.toggle('dark', dark);
  }
}
