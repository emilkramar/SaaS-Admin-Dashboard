import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { User as IUser } from '../../../core/models/user.model';
import { User as UserService } from '../../../core/services/user/user';
import { ProjectFormPageComponent } from './project-form-page.component';

describe('ProjectFormPageComponent', () => {
  let fixture: ComponentFixture<ProjectFormPageComponent>;
  let component: ProjectFormPageComponent;

  const mockUsers: IUser[] = [
    { id: 1, name: 'Test User', email: 't@company.com', role: 'Admin', status: 'Active' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectFormPageComponent],
      providers: [
        provideRouter([]),
        { provide: UserService, useValue: { getUsers: () => of(mockUsers) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load catalog users and add one from directory', () => {
    expect(component.catalogUsers()).toEqual(mockUsers);
    expect(component.usersLoading()).toBe(false);

    component.catalogSelection.set('1');
    component.addParticipantFromCatalog();
    fixture.detectChanges();

    expect(component.participants.length).toBe(1);
    expect(component.participants.at(0)?.get('userId')?.value).toBe(1);
  });
});
