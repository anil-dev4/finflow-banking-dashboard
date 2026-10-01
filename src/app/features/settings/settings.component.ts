import { ChangeDetectionStrategy, Component, inject, signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BankingStore } from '../../core/banking.store';
import { ModalComponent } from '../../shared/modal.component';
import { SettingsStore } from '../../core/settings.store';
@Component({
  selector: 'app-settings',
  imports: [ReactiveFormsModule, ModalComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  private readonly store = inject(BankingStore);
  readonly settings = inject(SettingsStore);
  readonly modal = viewChild.required(ModalComponent);
  readonly tab = signal<'general' | 'users'>('general');
  readonly message = signal('');
  readonly error = signal('');
  readonly resetPending = signal(false);
  readonly users = this.settings.users;
  readonly preferences = new FormGroup({
    workspace: new FormControl(this.settings.workspace(), {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(60)],
    }),
    digest: new FormControl(this.settings.digest(), { nonNullable: true }),
  });
  readonly userForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(60)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email, Validators.maxLength(120)],
    }),
    role: new FormControl<'Viewer' | 'Accountant'>('Viewer', { nonNullable: true }),
  });
  savePreferences(): void {
    if (this.preferences.invalid || !this.preferences.getRawValue().workspace.trim()) {
      this.message.set('Enter a workspace name of up to 60 characters.');
      return;
    }
    const { workspace, digest } = this.preferences.getRawValue();
    this.settings.savePreferences(workspace, digest);
    this.message.set('Demo preferences saved for this session. No emails will be sent.');
  }
  open(): void {
    this.userForm.reset({ name: '', email: '', role: 'Viewer' });
    this.error.set('');
    this.modal().open();
  }
  addUser(): void {
    const value = this.userForm.getRawValue();
    if (this.userForm.invalid || !value.name.trim()) {
      this.error.set('Enter a name and valid email address.');
      return;
    }
    try {
      this.settings.addUser(value);
    } catch (error: unknown) {
      this.error.set(error instanceof Error ? error.message : 'Unable to add user.');
      return;
    }
    this.modal().close();
    this.message.set('Demo user added. No invitation was sent.');
  }
  toggle(id: number): void {
    this.settings.toggleUser(id);
  }
  reset(): void {
    this.store.reset();
    this.resetPending.set(false);
    this.message.set('Accounts and transactions restored to the original sample data.');
  }
}
