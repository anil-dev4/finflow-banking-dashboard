import { afterNextRender, ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DEMO_CREDENTIALS, DemoSession } from '../../core/demo-session.service';
import { LoginPreferences } from '../../core/login-preferences.service';
import { IconComponent } from '../../shared/icon.component';
import { LoginStoryComponent } from './login-story.component';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, LoginStoryComponent, IconComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly session = inject(DemoSession);
  private readonly preferences = inject(LoginPreferences);
  private readonly router = inject(Router);
  readonly visible = signal(false);
  readonly error = signal('');
  readonly help = signal(false);
  readonly ready = signal(false);
  readonly form = new FormGroup({
    email: new FormControl<string>(DEMO_CREDENTIALS.email, {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl<string>(DEMO_CREDENTIALS.password, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    remember: new FormControl(false, { nonNullable: true }),
  });

  constructor() {
    afterNextRender(() => {
      this.form.controls.remember.setValue(this.preferences.isRemembered());
      this.ready.set(true);
    });
  }

  signIn(): void {
    this.form.markAllAsTouched();
    const { email, password } = this.form.getRawValue();
    if (this.form.invalid || !this.session.signIn(email, password)) {
      this.error.set('Use demo@finflow.com / FinFlowDemo!, or continue as a demo user.');
      return;
    }
    this.openDashboard();
  }

  enterDemo(): void {
    this.session.start();
    this.openDashboard();
  }

  private openDashboard(): void {
    this.preferences.remember(this.form.controls.remember.value);
    void this.router.navigateByUrl('/dashboard');
  }
}
