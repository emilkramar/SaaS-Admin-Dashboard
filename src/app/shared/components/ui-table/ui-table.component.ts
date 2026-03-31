import { Component, computed, effect, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subject } from 'rxjs';
import { UiBadgeComponent } from '../ui-badge/ui-badge.component';

export type PageSizeOption = 10 | 20 | 50;

export interface TableHeader {
  key: string;
  label: string;
  type: string;
  sort?: boolean;
}

@Component({
  selector: 'app-ui-table',
  imports: [UiBadgeComponent, FormsModule],
  templateUrl: './ui-table.component.html',
  styleUrl: './ui-table.component.css',
  standalone: true,
})
export class UiTableComponent {
  readonly pageSizeOptions: PageSizeOption[] = [10, 20, 50];

  headers = input<TableHeader[]>([]);
  rows = input<any[]>([]);
  loading = input<boolean>(true);

  searchValue = signal<string>('');
  filteredRows = signal<any[]>([]);

  pageSize = signal<PageSizeOption>(10);
  currentPage = signal(1);

  sortKey = signal<string | null>(null);
  sortDir = signal<'asc' | 'desc'>('asc');

  private searchSubject = new Subject<string>();

  displayRows = computed(() => {
    const rows = [...this.filteredRows()];
    const key = this.sortKey();
    const dir = this.sortDir();
    const header = this.headers().find((h) => h.key === key);
    if (!key || !header?.sort) {
      return rows;
    }

    const mul = dir === 'asc' ? 1 : -1;
    rows.sort(
      (a, b) =>
        mul *
        this.compareSortValues(
          this.getSortValue(a, key, header),
          this.getSortValue(b, key, header),
        ),
    );
    return rows;
  });

  totalItems = computed(() => this.displayRows().length);

  totalPages = computed(() => {
    const n = this.totalItems();
    if (n === 0) return 0;
    return Math.ceil(n / this.pageSize());
  });

  paginatedRows = computed(() => {
    const rows = this.displayRows();
    const size = this.pageSize();
    const page = this.currentPage();
    const start = (page - 1) * size;
    return rows.slice(start, start + size);
  });

  visiblePages = computed(() => {
    const total = this.totalPages();
    if (total <= 0) return [] as (number | 'ellipsis')[];
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    const cur = this.currentPage();
    const set = new Set<number>();
    set.add(1);
    set.add(total);
    for (let i = cur - 1; i <= cur + 1; i++) {
      if (i >= 1 && i <= total) set.add(i);
    }
    const sorted = [...set].sort((a, b) => a - b);
    const out: (number | 'ellipsis')[] = [];
    for (let i = 0; i < sorted.length; i++) {
      if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
        out.push('ellipsis');
      }
      out.push(sorted[i]);
    }
    return out;
  });

  constructor() {
    effect(() => {
      if (!this.searchValue().trim()) {
        this.filteredRows.set(this.rows());
      }
    });

    this.searchSubject
      .pipe(debounceTime(300))
      .subscribe((value) => {
        const term = value.trim().toLowerCase();
        if (!term) {
          this.filteredRows.set(this.rows());
        } else {
          this.filteredRows.set(
            this.rows().filter((item) =>
              Object.values(item).some((val) =>
                String(val).toLowerCase().includes(term)
              )
            )
          );
        }
        this.currentPage.set(1);
      });

    effect(() => {
      this.searchSubject.next(this.searchValue());
    });

    effect(() => {
      const total = this.totalPages();
      if (total === 0) return;
      const p = this.currentPage();
      if (p > total) this.currentPage.set(total);
      if (p < 1) this.currentPage.set(1);
    });
  }

  setPageSize(size: PageSizeOption): void {
    this.pageSize.set(size);
    this.currentPage.set(1);
  }

  goToPage(page: number): void {
    const total = this.totalPages();
    if (total === 0) return;
    const p = Math.min(Math.max(1, page), total);
    this.currentPage.set(p);
  }

  prevPage(): void {
    this.goToPage(this.currentPage() - 1);
  }

  nextPage(): void {
    this.goToPage(this.currentPage() + 1);
  }

  toggleSort(header: TableHeader): void {
    if (!header.sort) return;
    if (this.sortKey() === header.key) {
      this.sortDir.update((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortKey.set(header.key);
      this.sortDir.set('asc');
    }
    this.currentPage.set(1);
  }

  private getSortValue(row: unknown, key: string, header: TableHeader): string | number {
    const r = row as Record<string, unknown>;
    const v = r[key];
    if (header.type === 'badge' && v && typeof v === 'object' && v !== null && 'label' in v) {
      const label = (v as { label: unknown }).label;
      return label == null ? '' : String(label);
    }
    if (typeof v === 'number' && !Number.isNaN(v)) return v;
    if (v == null) return '';
    return String(v);
  }

  private compareSortValues(a: string | number, b: string | number): number {
    if (typeof a === 'number' && typeof b === 'number') {
      return a === b ? 0 : a < b ? -1 : 1;
    }
    return String(a).localeCompare(String(b), undefined, {
      numeric: true,
      sensitivity: 'base',
    });
  }
}
