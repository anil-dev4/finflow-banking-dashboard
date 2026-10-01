import { Injectable, signal } from '@angular/core';

export interface DemoUser {
  readonly id: number;
  readonly name: string;
  readonly email: string;
  readonly role: 'Viewer' | 'Accountant';
  readonly active: boolean;
}

@Injectable({ providedIn: 'root' })
export class SettingsStore {
  private readonly workspaceState = signal('FinFlow Demo');
  private readonly digestState = signal(true);
  private readonly userState = signal<readonly DemoUser[]>([
    { id: 1, name: 'Alex Morgan', email: 'alex@example.com', role: 'Accountant', active: true },
    { id: 2, name: 'Sam Taylor', email: 'sam@example.com', role: 'Viewer', active: true },
  ]);
  readonly workspace = this.workspaceState.asReadonly();
  readonly digest = this.digestState.asReadonly();
  readonly users = this.userState.asReadonly();

  savePreferences(workspace: string, digest: boolean): void {
    if (!workspace.trim() || workspace.trim().length > 60)
      throw new Error('Enter a workspace name of up to 60 characters.');
    this.workspaceState.set(workspace.trim());
    this.digestState.set(digest);
  }

  addUser(input: Omit<DemoUser, 'id' | 'active'>): void {
    if (this.users().some((u) => u.email.toLowerCase() === input.email.trim().toLowerCase())) {
      throw new Error('A user with this email already exists.');
    }
    this.userState.update((users) => [
      ...users,
      {
        ...input,
        name: input.name.trim(),
        email: input.email.trim(),
        id: Math.max(...users.map((u) => u.id), 0) + 1,
        active: true,
      },
    ]);
  }

  toggleUser(id: number): void {
    this.userState.update((users) =>
      users.map((user) => (user.id === id ? { ...user, active: !user.active } : user)),
    );
  }

  reset(): void {
    this.workspaceState.set('FinFlow Demo');
    this.digestState.set(true);
    this.userState.set([
      { id: 1, name: 'Alex Morgan', email: 'alex@example.com', role: 'Accountant', active: true },
      { id: 2, name: 'Sam Taylor', email: 'sam@example.com', role: 'Viewer', active: true },
    ]);
  }
}
