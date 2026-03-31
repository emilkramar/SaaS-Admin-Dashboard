import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable } from 'rxjs';
import { AnalyticsSummary } from '../../models/analytics.model';

@Injectable({
  providedIn: 'root',
})
export class Analytics {
  private _http = inject(HttpClient);

  getSummary(): Observable<AnalyticsSummary> {
    return this._http
      .get<AnalyticsSummary>('assets/data/analytics.json')
      .pipe(delay(1200));
  }
}
