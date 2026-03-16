import {inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {delay, Observable} from 'rxjs';
import {User as IUser} from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class User {

  private _http = inject(HttpClient);

  getUsers(): Observable<IUser[]> {
    return this._http.get<IUser[]>('assets/data/users.json')
      .pipe(
        delay(2000)
      );

  }
}
