import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CalendarDatePipe } from '../../shared/calendar-date.pipe';
import { RouterLink } from '@angular/router';
import { BankingStore } from '../../core/banking.store';
import { MoneyPipe } from '../../shared/money.pipe';
import { TrendComponent } from '../../shared/trend.component';
import { AccountDistributionComponent } from './account-distribution.component';
@Component({
  selector: 'app-dashboard',
  imports: [MoneyPipe, CalendarDatePipe, RouterLink, TrendComponent, AccountDistributionComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  readonly store = inject(BankingStore);
  readonly recent = computed(() =>
    [...this.store.transactions()]
      .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id))
      .slice(0, 5),
  );
}
