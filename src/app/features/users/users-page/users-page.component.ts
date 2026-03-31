import {Component, inject, signal} from '@angular/core';
import {User} from '../../../core/services/user/user';
import {User as IUser} from '../../../core/models/user.model';
import {TableHeader, UiTableComponent} from '../../../shared/components/ui-table/ui-table.component';
import {map} from 'rxjs';

@Component({
  selector: 'app-users-page',
  imports: [
    UiTableComponent
  ],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.css',
  standalone: true
})
export class UsersPageComponent {

  private _users = inject(User);

  public headers: TableHeader[] = [
    { key: 'name', label: 'Name', type: 'text', sort: true },
    { key: 'email', label: 'Email', type: 'text', sort: true },
    { key: 'role', label: 'Role', type: 'text', sort: true },
    { key: 'status', label: 'Status', type: 'badge', sort: true }
  ]

  users = signal<IUser[]>([])
  loading = signal<boolean>(true)

  constructor() {
    this._users.getUsers().pipe(
      map((users: IUser[]) =>
        users.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: {
            label: user.status,
            color: user.status === 'Active' ?  'success' : user.status === 'Pending' ? 'warning' : 'error'
          }
        }))
      )
    ).subscribe( (res: any) => {
      this.users.set(res);
      this.loading.set(false);
    })
  }
}
