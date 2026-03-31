import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, map, Observable } from 'rxjs';

import { Project as IProject } from '../../models/project.model';

const PROJECTS_URL = 'assets/data/projects.json';

@Injectable({
  providedIn: 'root',
})
export class Project {
  private _http = inject(HttpClient);

  getProjects(): Observable<IProject[]> {
    return this._http.get<IProject[]>(PROJECTS_URL).pipe(delay(600));
  }

  getProjectById(id: number): Observable<IProject | undefined> {
    return this._http.get<IProject[]>(PROJECTS_URL).pipe(
      delay(450),
      map((list) => list.find((p) => p.id === id)),
    );
  }
}
