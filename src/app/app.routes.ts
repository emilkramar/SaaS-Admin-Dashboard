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
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./features/projects/projects-page/projects-page.component').then(
            (m) => m.ProjectsPageComponent,
          ),
      },
      {
        path: 'projects/new',
        loadComponent: () =>
          import('./features/projects/project-form-page/project-form-page.component').then(
            (m) => m.ProjectFormPageComponent,
          ),
      },
      {
        path: 'projects/:id/details',
        loadComponent: () =>
          import('./features/projects/project-details-page/project-details-page.component').then(
            (m) => m.ProjectDetailsPageComponent,
          ),
      },
    ]
  }
];
