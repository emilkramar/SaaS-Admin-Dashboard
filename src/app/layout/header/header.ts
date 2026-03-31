import { Component, inject, signal } from '@angular/core';
import { ThemeService } from '../../core/services/theme/theme.service';
import { ShellLayoutService } from '../shell-layout.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
  standalone: true,
})
export class Header {
  protected shell = inject(ShellLayoutService);
  protected theme = inject(ThemeService);

  /** Demo profile — swap for auth user when wired up. */
  protected userName = signal('Alex Morgan');
  /** Unread count for notifications badge (0 hides the dot). */
  protected notificationCount = signal(3);

  protected onNotificationsClick(): void {
    // Hook: open panel or navigate to /notifications
  }
}
