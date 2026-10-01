import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BankingStore } from '../../core/banking.store';
import { IconComponent, IconName } from '../../shared/icon.component';
import { MoneyPipe } from '../../shared/money.pipe';
import { TrendComponent } from '../../shared/trend.component';

@Component({
  selector: 'app-dashboard-preview',
  imports: [TrendComponent, IconComponent, MoneyPipe],
  templateUrl: './dashboard-preview.component.html',
  styleUrl: './dashboard-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPreviewComponent {
  readonly store = inject(BankingStore);
  readonly navigation: readonly { name: string; icon: IconName }[] = [
    { name: 'Dashboard', icon: 'home' },
    { name: 'Accounts', icon: 'wallet' },
    { name: 'Transactions', icon: 'transfer' },
    { name: 'General Ledger', icon: 'file' },
    { name: 'Reports', icon: 'chart' },
    { name: 'Settings', icon: 'settings' },
  ];
}
