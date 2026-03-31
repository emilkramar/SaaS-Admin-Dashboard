import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ShellLayoutService } from '../shell-layout.service';

export interface NavItem {
  order: number;
  id: string;
  label: string;
  path: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  standalone: true,
})
export class Sidebar {
  private shell = inject(ShellLayoutService);

  navItems = signal<NavItem[]>([]);

  onNavClick(): void {
    this.shell.closeSidebar();
  }

  constructor() {
    this.navItems.set([
      { order: 1, id: 'dashboard', label: 'Dashboard', path: '/' },
      { order: 2, id: 'users', label: 'Users', path: '/users' },
      { order: 3, id: 'projects', label: 'Projects', path: '/projects' },
    ]);
  }
}
