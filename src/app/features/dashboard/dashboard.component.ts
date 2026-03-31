import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Activity as IActivity } from '../../core/models/activity.model';
import { AnalyticsSummary } from '../../core/models/analytics.model';
import { Activity } from '../../core/services/activity/activity';
import { Analytics } from '../../core/services/analytics/analytics';
import { UiCardComponent } from '../../shared/components/ui-card/ui-card.component';
import { UiChartComponent } from '../../shared/components/ui-chart/ui-chart.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    UiCardComponent,
    UiChartComponent,
    DecimalPipe,
    CurrencyPipe,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  standalone: true,
})
export class DashboardComponent {
  private _analytics = inject(Analytics);
  private _activity = inject(Activity);

  metrics = signal<AnalyticsSummary | null>(null);
  activities = signal<IActivity[]>([]);

  metricsLoading = signal(true);
  activitiesLoading = signal(true);

  constructor() {
    this._analytics.getSummary().subscribe({
      next: (data) => {
        this.metrics.set(data);
        this.metricsLoading.set(false);
      },
      error: () => {
        this.metricsLoading.set(false);
      },
    });

    this._activity.getActivities().subscribe({
      next: (rows) => {
        this.activities.set(rows.slice(0, 8));
        this.activitiesLoading.set(false);
      },
      error: () => {
        this.activitiesLoading.set(false);
      },
    });
  }
}
