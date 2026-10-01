import { inject } from '@angular/core';
import { CanActivateFn, Router, Routes } from '@angular/router';
import { DemoSession } from './core/demo-session.service';

const demoGuard: CanActivateFn = () =>
  inject(DemoSession).active() || inject(Router).createUrlTree(['/login']);
export const routes: Routes = [
  {
    path: 'login',
    title: 'Welcome · FinFlow',
    loadComponent: () => import('./features/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    canActivate: [demoGuard],
    loadComponent: () => import('./layout/shell.component').then((m) => m.ShellComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        title: 'Dashboard · FinFlow',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'accounts',
        title: 'Accounts · FinFlow',
        loadComponent: () =>
          import('./features/accounts/accounts.component').then((m) => m.AccountsComponent),
      },
      {
        path: 'transactions',
        title: 'Transactions · FinFlow',
        loadComponent: () =>
          import('./features/transactions/transactions.component').then(
            (m) => m.TransactionsComponent,
          ),
      },
      {
        path: 'ledger',
        title: 'General ledger · FinFlow',
        loadComponent: () =>
          import('./features/ledger/ledger.component').then((m) => m.LedgerComponent),
      },
      {
        path: 'reports',
        title: 'Reports · FinFlow',
        loadComponent: () =>
          import('./features/reports/reports.component').then((m) => m.ReportsComponent),
      },
      {
        path: 'settings',
        title: 'Settings · FinFlow',
        loadComponent: () =>
          import('./features/settings/settings.component').then((m) => m.SettingsComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
