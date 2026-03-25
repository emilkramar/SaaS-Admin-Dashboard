import { Component, computed, effect, input, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subject } from 'rxjs';
import { UiBadgeComponent } from '../ui-badge/ui-badge.component';

export interface TableHeader {
  key: string;
  label: string;
  type: string;
}

@Component({
  selector: 'app-ui-table',
  imports: [UiBadgeComponent, FormsModule],
  templateUrl: './ui-table.component.html',
  styleUrl: './ui-table.component.css',
  standalone: true,
})
export class UiTableComponent {
  headers = input<TableHeader[]>([]);
  rows = input<any[]>([]);
  loading = input<boolean>(true);

  searchValue = signal<string>('');
  filteredRows = signal<any[]>([]);

  private searchSubject = new Subject<string>();

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
          return;
        }
        this.filteredRows.set(
          this.rows().filter((item) =>
            Object.values(item).some((val) =>
              String(val).toLowerCase().includes(term)
            )
          )
        );
      });

    effect(() => {
      this.searchSubject.next(this.searchValue());
    });
  }
}
