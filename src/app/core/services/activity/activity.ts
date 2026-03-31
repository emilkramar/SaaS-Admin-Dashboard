import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable } from 'rxjs';
import { Activity as IActivity } from '../../models/activity.model';

@Injectable({
  providedIn: 'root',
})
export class Activity {
  private _http = inject(HttpClient);

  getActivities(): Observable<IActivity[]> {
    return this._http
      .get<IActivity[]>('assets/data/activity.json')
      .pipe(delay(900));
  }
}
