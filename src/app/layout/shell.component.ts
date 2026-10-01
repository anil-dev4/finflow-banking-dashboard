import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DemoSession } from '../core/demo-session.service';
import { BankingStore } from '../core/banking.store';
import { BrandComponent } from '../shared/brand.component';
import { SettingsStore } from '../core/settings.store';
@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, BrandComponent],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent {
  private readonly router = inject(Router);
  readonly session = inject(DemoSession);
  private readonly store = inject(BankingStore);
  readonly settings = inject(SettingsStore);
  readonly menuOpen = signal(false);
  readonly links = [
    { path: '/dashboard', label: 'Dashboard', icon: '◈' },
    { path: '/accounts', label: 'Accounts', icon: '▣' },
    { path: '/transactions', label: 'Transactions', icon: '⇄' },
    { path: '/ledger', label: 'General ledger', icon: '▤' },
    { path: '/reports', label: 'Reports', icon: '▥' },
    { path: '/settings', label: 'Settings', icon: '⚙' },
  ];
  signOut(): void {
    this.session.end();
    this.store.reset();
    this.settings.reset();
    void this.router.navigateByUrl('/login');
  }
}
