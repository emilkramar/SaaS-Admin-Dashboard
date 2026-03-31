import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { User as IUser } from '../../../core/models/user.model';
import { User } from '../../../core/services/user/user';
import { UiTableComponent } from '../../../shared/components/ui-table/ui-table.component';
import { UsersPageComponent } from './users-page.component';

describe('UsersPageComponent', () => {
  let fixture: ComponentFixture<UsersPageComponent>;
  let component: UsersPageComponent;
  let getUsersCallCount = 0;

  const apiUsers: IUser[] = [
    {
      id: 1,
      name: 'Anna Smith',
      email: 'anna@company.com',
      role: 'User',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Bob Jones',
      email: 'bob@company.com',
      role: 'Admin',
      status: 'Pending',
    },
  ];

  beforeEach(async () => {
    getUsersCallCount = 0;
    const userStub = {
      getUsers: () => {
        getUsersCallCount += 1;
        return of(apiUsers);
      },
    };

    await TestBed.configureTestingModule({
      imports: [UsersPageComponent],
      providers: [{ provide: User, useValue: userStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call User.getUsers on init', () => {
    expect(getUsersCallCount).toBe(1);
  });

  it('should map API users into table rows with badge status (Active → success)', () => {
    const rows = component.users();
    expect(rows.length).toBe(2);
    const anna = rows.find((r) => r.name === 'Anna Smith');
    expect(anna).toBeDefined();
    expect(anna!.status.label).toBe('Active');
    expect(anna!.status.color).toBe('success');
  });

  it('should map Pending status to warning color', () => {
    const bob = component.users().find((r) => r.name === 'Bob Jones');
    expect(bob!.status.label).toBe('Pending');
    expect(bob!.status.color).toBe('warning');
  });

  describe('Users page → table integration', () => {
    it('should pass headers, rows, and loading into app-ui-table', () => {
      const tableDe = fixture.debugElement.query(By.directive(UiTableComponent));
      expect(tableDe).toBeTruthy();

      const table = tableDe.componentInstance as UiTableComponent;
      expect(table.headers()).toEqual(component.headers);
      expect(table.rows()).toEqual(component.users());
      expect(table.loading()).toBe(false);
    });

    it('should filter table rows when search changes on the embedded table', async () => {
      const tableDe = fixture.debugElement.query(By.directive(UiTableComponent));
      const table = tableDe.componentInstance as UiTableComponent;

      table.searchValue.set('Bob');
      await new Promise<void>((r) => setTimeout(r, 350));
      fixture.detectChanges();

      const domRows = fixture.debugElement.queryAll(By.css('tbody tr'));
      expect(domRows.length).toBe(1);
      expect(domRows[0].nativeElement.textContent).toContain('Bob');
    });
  });
});
