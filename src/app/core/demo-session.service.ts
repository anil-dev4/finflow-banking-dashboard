import { computed, Injectable, signal } from '@angular/core';

export const DEMO_CREDENTIALS = { email: 'demo@finflow.com', password: 'FinFlowDemo!' } as const;
export const DEMO_PROFILE = {
  name: 'Demo User',
  email: DEMO_CREDENTIALS.email,
  role: 'Demo administrator',
  initials: 'DU',
} as const;

/** Navigation state for a fictional user, not a real authentication or authorisation system. */
@Injectable({ providedIn: 'root' })
export class DemoSession {
  private readonly profileState = signal<typeof DEMO_PROFILE | null>(null);
  readonly profile = this.profileState.asReadonly();
  readonly active = computed(() => this.profile() !== null);

  signIn(email: string, password: string): boolean {
    if (
      email.trim().toLowerCase() !== DEMO_CREDENTIALS.email ||
      password !== DEMO_CREDENTIALS.password
    )
      return false;
    this.start();
    return true;
  }

  start(): void {
    this.profileState.set(DEMO_PROFILE);
  }
  end(): void {
    this.profileState.set(null);
  }
}
