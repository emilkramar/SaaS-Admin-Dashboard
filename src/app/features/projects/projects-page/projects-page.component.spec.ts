import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { Project as IProject } from '../../../core/models/project.model';
import { Project } from '../../../core/services/project/project';
import { UiTableComponent } from '../../../shared/components/ui-table/ui-table.component';
import { ProjectsPageComponent } from './projects-page.component';

describe('ProjectsPageComponent', () => {
  let fixture: ComponentFixture<ProjectsPageComponent>;
  let component: ProjectsPageComponent;

  const apiProjects: IProject[] = [
    {
      id: 1,
      name: 'Alpha',
      created_at: '2026-01-01T00:00:00.000Z',
      label: 'NEW',
    },
    {
      id: 2,
      name: 'Beta build',
      created_at: '2026-02-15T00:00:00.000Z',
      label: 'INPROGRESS',
    },
  ];

  beforeEach(async () => {
    const projectStub = {
      getProjects: () => of(apiProjects),
    };

    await TestBed.configureTestingModule({
      imports: [ProjectsPageComponent],
      providers: [provideRouter([]), { provide: Project, useValue: projectStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should map API projects into table rows with label badges', () => {
    const rows = component.projects();
    expect(rows.length).toBe(2);
    const alpha = rows.find((r) => r.name === 'Alpha');
    expect(alpha?.label.label).toBe('NEW');
    expect(alpha?.label.color).toBe('info');
    const beta = rows.find((r) => r.name === 'Beta build');
    expect(beta?.label.label).toBe('IN PROGRESS');
    expect(beta?.label.color).toBe('warning');
  });

  it('should bind the table with headers, rows, and loading', () => {
    const tableDe = fixture.debugElement.query(By.directive(UiTableComponent));
    expect(tableDe).toBeTruthy();
    const table = tableDe.componentInstance as UiTableComponent;
    expect(table.headers().length).toBe(3);
    expect(table.headers()).toEqual(component.headers);
    expect(fixture.debugElement.queryAll(By.css('thead th')).length).toBe(4);
    expect(table.rows()).toEqual(component.projects());
    expect(table.loading()).toBe(false);
  });
});
