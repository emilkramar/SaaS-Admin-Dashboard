import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

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
  standalone: true
})
export class Sidebar {

  navItems = signal<NavItem[]>([]);

  constructor() {
    this.navItems.set([
      { order: 1, id: 'dashboard', label: 'Dashboard', path: '/' },
      { order: 2, id: 'users', label: 'Users', path: '/users' }
    ]);
  }
}
