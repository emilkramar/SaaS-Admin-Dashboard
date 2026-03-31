import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { ProjectLabel } from '../../../core/models/project.model';
import { User as IUser } from '../../../core/models/user.model';
import { User as UserService } from '../../../core/services/user/user';
import { UiButtonComponent } from '../../../shared/components/ui-button/ui-button.component';

const inputClass =
  'w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20';

@Component({
  selector: 'app-project-form-page',
  imports: [ReactiveFormsModule, RouterLink, UiButtonComponent],
  templateUrl: './project-form-page.component.html',
  styleUrl: './project-form-page.component.css',
  standalone: true,
})
export class ProjectFormPageComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private userApi = inject(UserService);

  protected readonly fieldClass = inputClass;

  protected readonly labelOptions: { value: ProjectLabel; label: string }[] = [
    { value: 'NEW', label: 'New' },
    { value: 'INPROGRESS', label: 'In progress' },
    { value: 'FINISHED', label: 'Finished' },
  ];

  readonly catalogUsers = signal<IUser[]>([]);
  readonly usersLoading = signal(true);

  readonly catalogSelection = signal('');

  form = this.fb.group(
    {
      name: ['', [Validators.required, Validators.maxLength(200)]],
      label: ['NEW' as ProjectLabel, Validators.required],
      timeStart: ['', Validators.required],
      timeEnd: ['', Validators.required],
      participants: this.fb.array<FormGroup>([]),
    },
    { validators: endAfterStart },
  );

  constructor() {
    this.userApi.getUsers().subscribe((users) => {
      this.catalogUsers.set(users);
      this.usersLoading.set(false);
    });
  }

  get participants(): FormArray {
    return this.form.get('participants') as FormArray;
  }

  protected onCatalogSelect(ev: Event): void {
    const v = (ev.target as HTMLSelectElement).value;
    this.catalogSelection.set(v);
  }

  protected isUserAlreadyAdded(userId: number): boolean {
    return this.participants.controls.some((c) => c.get('userId')?.value === userId);
  }

  addParticipantFromCatalog(): void {
    const raw = this.catalogSelection();
    if (!raw) return;
    const userId = Number(raw);
    if (Number.isNaN(userId)) return;
    if (this.isUserAlreadyAdded(userId)) return;

    const u = this.catalogUsers().find((x) => x.id === userId);
    if (!u) return;

    this.participants.push(
      this.fb.group({
        userId: [u.id, Validators.required],
        name: [u.name],
        role: [u.role],
        email: [u.email],
      }),
    );
    this.catalogSelection.set('');
  }

  removeParticipant(index: number): void {
    this.participants.removeAt(index);
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const raw = this.form.getRawValue();
    const payload = {
      name: raw.name,
      label: raw.label,
      timeStart: raw.timeStart,
      timeEnd: raw.timeEnd,
      participants: raw.participants,
    };

    alert(`Project draft saved (demo only):\n\n${JSON.stringify(payload, null, 2)}`);
    void this.router.navigate(['/projects']);
  }
}

function endAfterStart(group: AbstractControl): ValidationErrors | null {
  const start = group.get('timeStart')?.value;
  const end = group.get('timeEnd')?.value;
  if (!start || !end) return null;
  const a = new Date(start).getTime();
  const b = new Date(end).getTime();
  if (Number.isNaN(a) || Number.isNaN(b)) return null;
  return b >= a ? null : { endBeforeStart: true };
}
