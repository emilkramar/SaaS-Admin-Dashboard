import {
  AfterViewInit,
  Component,
  ElementRef,
  input,
  OnDestroy,
  ViewChild,
  effect,
} from '@angular/core';
import { Chart, registerables } from 'chart.js';


@Component({
  selector: 'app-ui-chart',
  templateUrl: './ui-chart.component.html',
  styleUrl: './ui-chart.component.css',
  standalone: true,
})
export class UiChartComponent implements AfterViewInit, OnDestroy {
  chartKind = input<'line' | 'bar'>('line');
  labels = input<string[]>([]);
  values = input<number[]>([]);
  datasetLabel = input<string>('');
  chartTitle = input<string>('');

  @ViewChild('canvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  private chart: Chart | undefined;
  private lastKind: 'line' | 'bar' | null = null;
  private viewReady = false;

  constructor() {
    Chart.register(...registerables);

    effect(() => {
      this.labels();
      this.values();
      this.chartKind();
      this.datasetLabel();
      if (this.viewReady) {
        this.syncChart();
      }
    });
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.syncChart();
  }

  ngOnDestroy(): void {
    this.destroyChart();
  }

  private syncChart(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;

    const kind = this.chartKind();
    const labels = [...this.labels()];
    const values = [...this.values()];
    const label = this.datasetLabel();

    if (!this.chart || this.lastKind !== kind) {
      this.destroyChart();
      this.chart = new Chart(canvas, {
        type: kind,
        data: {
          labels,
          datasets: [
            {
              label,
              data: values,
              borderColor: '#0071e3',
              backgroundColor:
                kind === 'bar'
                  ? 'rgba(0, 113, 227, 0.25)'
                  : 'rgba(0, 113, 227, 0.12)',
              fill: kind === 'line',
              tension: 0.35,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: !!label },
          },
          scales: {
            y: { beginAtZero: true },
          },
        },
      });
      this.lastKind = kind;
      return;
    }

    this.chart.data.labels = labels;
    const ds = this.chart.data.datasets[0];
    if (ds) {
      ds.data = values;
      ds.label = label;
    }
    this.chart.update();
  }

  private destroyChart(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = undefined;
      this.lastKind = null;
    }
  }
}
