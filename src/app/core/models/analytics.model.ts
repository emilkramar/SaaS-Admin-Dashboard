export interface TrendSeries {
  labels: string[];
  values: number[];
}

export interface AnalyticsSummary {
  totalUsers: number;
  revenue: number;
  growth: number;
  usersTrend: TrendSeries;
  revenueTrend: TrendSeries;
}
