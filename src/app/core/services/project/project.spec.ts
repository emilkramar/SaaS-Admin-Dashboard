import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { Project as IProject } from '../../models/project.model';
import { Project } from './project';

describe('Project', () => {
  let service: Project;
  let httpMock: HttpTestingController;

  const mockProjects: IProject[] = [
    {
      id: 1,
      name: 'Test project',
      created_at: '2026-03-31T00:00:00.000Z',
      label: 'NEW',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(Project);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should return projects after request completes and delay elapses', async () => {
    let received: IProject[] | undefined;
    service.getProjects().subscribe((data) => {
      received = data;
    });

    const req = httpMock.expectOne('assets/data/projects.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockProjects);

    expect(received).toBeUndefined();
    await new Promise<void>((r) => setTimeout(r, 650));

    expect(received).toEqual(mockProjects);
  });

  it('getProjectById should return one project after delay', async () => {
    let received: IProject | undefined;
    service.getProjectById(1).subscribe((data) => {
      received = data;
    });

    const req = httpMock.expectOne('assets/data/projects.json');
    req.flush(mockProjects);

    expect(received).toBeUndefined();
    await new Promise<void>((r) => setTimeout(r, 500));

    expect(received).toEqual(mockProjects[0]);
  });

  it('getProjectById should return undefined when id missing', async () => {
    let received: IProject | undefined;
    service.getProjectById(999).subscribe((data) => {
      received = data;
    });

    const req = httpMock.expectOne('assets/data/projects.json');
    req.flush(mockProjects);

    await new Promise<void>((r) => setTimeout(r, 500));

    expect(received).toBeUndefined();
  });
});
