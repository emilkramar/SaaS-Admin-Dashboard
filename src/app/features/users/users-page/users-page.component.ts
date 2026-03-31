import { Component, inject, signal, viewChild } from '@angular/core';
import { map } from 'rxjs';
import { User as IUser } from '../../../core/models/user.model';
import { User } from '../../../core/services/user/user';
import { UiButtonComponent } from '../../../shared/components/ui-button/ui-button.component';
import { TableHeader, UiTableComponent } from '../../../shared/components/ui-table/ui-table.component';
import { buildCsv, downloadCsv } from '../../../shared/utils/csv-export';

/** Redak koji tablica prikazuje (status je badge objekt, ne string s API-ja). */
export interface UsersTableRow {
  id: number;
  name: string;
  email: string;
  role: string;
  status: { label: string; color: string };
}

@Component({
  selector: 'app-users-page',
  imports: [UiTableComponent, UiButtonComponent],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.css',
  standalone: true
})
export class UsersPageComponent {

  private _users = inject(User);
  protected tableRef = viewChild(UiTableComponent);

  public headers: TableHeader[] = [
    { key: 'name', label: 'Name', type: 'text', sort: true },
    { key: 'email', label: 'Email', type: 'text', sort: true },
    { key: 'role', label: 'Role', type: 'text', sort: true },
    { key: 'status', label: 'Status', type: 'badge', sort: true }
  ]

  users = signal<UsersTableRow[]>([]);
  loading = signal<boolean>(true);

  constructor() {
    this._users
      .getUsers()
      .pipe(
        map((users: IUser[]) =>
          users.map(
            (user): UsersTableRow => ({
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              status: {
                label: user.status,
                color:
                  user.status === 'Active'
                    ? 'success'
                    : user.status === 'Pending'
                      ? 'warning'
                      : 'error',
              },
            }),
          ),
        ),
      )
      .subscribe((rows: UsersTableRow[]) => {
        this.users.set(rows);
        this.loading.set(false);
      });
  }

  exportUsersCsv(): void {
    const rows = (this.tableRef()?.getExportRows() as UsersTableRow[]) ?? this.users();
    const csv = buildCsv(
      ['ID', 'Name', 'Email', 'Role', 'Status'],
      rows.map((r) => [
        r.id,
        r.name,
        r.email,
        r.role,
        r.status.label,
      ]),
    );
    const stamp = new Date().toISOString().slice(0, 10);
    downloadCsv(`users-export-${stamp}.csv`, csv);
  }
}
