import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';

import { Project as IProject, ProjectLabel } from '../../../core/models/project.model';
import { Project } from '../../../core/services/project/project';
import { UiButtonComponent } from '../../../shared/components/ui-button/ui-button.component';
import {
  TableAction,
  TableHeader,
  UiTableComponent,
} from '../../../shared/components/ui-table/ui-table.component';

export interface ProjectsTableRow {
  id: number;
  name: string;
  created_at: string;
  label: { label: string; color: 'success' | 'warning' | 'info' | 'neutral' };
}

@Component({
  selector: 'app-projects-page',
  imports: [UiTableComponent, UiButtonComponent],
  templateUrl: './projects-page.component.html',
  styleUrl: './projects-page.component.css',
  standalone: true,
})
export class ProjectsPageComponent {
  private _projects = inject(Project);
  private _router = inject(Router);

  headers: TableHeader[] = [
    { key: 'name', label: 'Name', type: 'text', sort: true },
    { key: 'created_at', label: 'Created', type: 'date', sort: true },
    { key: 'label', label: 'Label', type: 'badge', sort: true },
  ];

  rowActions: TableAction[] = [
    { param: 'view', label: 'View', permission: true },
    { param: 'edit', label: 'Edit', permission: true },
    { param: 'archive', label: 'Archive', permission: true },
  ];

  projects = signal<ProjectsTableRow[]>([]);
  loading = signal(true);

  constructor() {
    this._projects
      .getProjects()
      .pipe(
        map((items: IProject[]) =>
          items.map(
            (p): ProjectsTableRow => ({
              id: p.id,
              name: p.name,
              created_at: p.created_at,
              label: labelToBadge(p.label),
            }),
          ),
        ),
      )
      .subscribe((rows) => {
        this.projects.set(rows);
        this.loading.set(false);
      });
  }

  goToNewProject(): void {
    void this._router.navigate(['/projects', 'new']);
  }

  goToProjectDetails(row: unknown): void {
    const r = row as ProjectsTableRow;
    void this._router.navigate(['/projects', r.id, 'details']);
  }

  onTableAction(event: { param: string; row: unknown }): void {
    const r = event.row as ProjectsTableRow;
    switch (event.param) {
      case 'view':
        void this._router.navigate(['/projects', r.id, 'details']);
        break;
      case 'edit':
        alert(`Edit "${r.name}" (demo).`);
        break;
      case 'archive':
        if (confirm(`Archive "${r.name}"? This demo does not change data.`)) {
          alert('Archived (demo).');
        }
        break;
      default:
        break;
    }
  }
}

function labelToBadge(label: ProjectLabel): ProjectsTableRow['label'] {
  switch (label) {
    case 'NEW':
      return { label: 'NEW', color: 'info' };
    case 'INPROGRESS':
      return { label: 'IN PROGRESS', color: 'warning' };
    case 'FINISHED':
      return { label: 'FINISHED', color: 'success' };
    default:
      return { label: String(label), color: 'neutral' };
  }
}
