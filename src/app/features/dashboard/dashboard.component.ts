import {Component, inject, signal} from '@angular/core';
import {User} from '../../core/services/user/user';
import {User as IUser} from '../../core/models/user.model';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  standalone: true
})
export class DashboardComponent {
  private _users = inject(User);

  users = signal<IUser[]>([])

  constructor() {
    this._users.getUsers().subscribe( (res: IUser[]) => {
      this.users.set(res)
    })

  }

}
