import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, of, switchMap } from 'rxjs';

import { Project as IProject, ProjectLabel } from '../../../core/models/project.model';
import { Project } from '../../../core/services/project/project';
import { UiBadgeComponent } from '../../../shared/components/ui-badge/ui-badge.component';

@Component({
  selector: 'app-project-details-page',
  imports: [RouterLink, DatePipe, UiBadgeComponent],
  templateUrl: './project-details-page.component.html',
  styleUrl: './project-details-page.component.css',
  standalone: true,
})
export class ProjectDetailsPageComponent {
  private _projects = inject(Project);
  private _route = inject(ActivatedRoute);

  loading = signal(true);
  project = signal<IProject | undefined>(undefined);

  labelBadge = computed(() => {
    const p = this.project();
    if (!p) return null;
    return labelToBadge(p.label);
  });

  constructor() {
    this._route.paramMap
      .pipe(
        map((pm) => Number(pm.get('id'))),
        switchMap((id) => {
          this.loading.set(true);
          this.project.set(undefined);
          if (Number.isNaN(id)) {
            return of(undefined);
          }
          return this._projects.getProjectById(id);
        }),
        takeUntilDestroyed(),
      )
      .subscribe((p) => {
        this.project.set(p);
        this.loading.set(false);
      });
  }
}

function labelToBadge(label: ProjectLabel): { label: string; color: 'success' | 'warning' | 'info' | 'neutral' } {
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
