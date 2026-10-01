import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { DEMO_CREDENTIALS } from './demo-session.service';

/** Only the demo email may be remembered. Never persist passwords or session permissions. */
@Injectable({ providedIn: 'root' })
export class LoginPreferences {
  private readonly document = inject(DOCUMENT);
  private readonly key = 'finflow.demo-email';

  isRemembered(): boolean {
    try {
      return this.document.defaultView?.localStorage.getItem(this.key) === DEMO_CREDENTIALS.email;
    } catch {
      return false;
    }
  }

  remember(enabled: boolean): void {
    try {
      const storage = this.document.defaultView?.localStorage;
      if (enabled) storage?.setItem(this.key, DEMO_CREDENTIALS.email);
      else storage?.removeItem(this.key);
    } catch {
      /* Storage may be disabled; the demo remains usable without it. */
    }
  }
}
