import { Routes } from '@angular/router';
import {MainLayout} from './layout/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./features/users/users-page/users-page.component').then(m => m.UsersPageComponent)
      }
    ]
  }
];
