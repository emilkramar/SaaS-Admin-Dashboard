import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { User as IUser } from '../../models/user.model';
import { User } from './user';

describe('User', () => {
  let service: User;
  let httpMock: HttpTestingController;

  const mockUsers: IUser[] = [
    {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      role: 'Admin',
      status: 'Active',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(User);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should request users from the correct URL with GET', () => {
    service.getUsers().subscribe();

    const req = httpMock.expectOne((request) => request.url === 'assets/data/users.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should return the response body as IUser[] after the request completes and delay elapses', async () => {
    let result: IUser[] | undefined;

    service.getUsers().subscribe((users) => {
      result = users;
    });

    const req = httpMock.expectOne('assets/data/users.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);

    expect(result).toBeUndefined();

    await new Promise<void>((resolve) => setTimeout(resolve, 2100));

    expect(result).toEqual(mockUsers);
  });
});
