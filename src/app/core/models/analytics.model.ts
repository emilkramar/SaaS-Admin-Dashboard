export interface TrendSeries {
  labels: string[];
  values: number[];
}

export interface AnalyticsSummary {
  totalUsers: number;
  revenue: number;
  growth: number;
  /** For chart: users over time */
  usersTrend: TrendSeries;
  /** For chart: revenue over time */
  revenueTrend: TrendSeries;
}
