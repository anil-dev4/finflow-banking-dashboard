import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { BankingStore } from '../core/banking.store';
@Component({
  selector: 'app-trend',
  host: {'[class.compact]': 'compact()'},
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (!compact()) {
      <div class="chart-key">
        <span><i></i> Debit</span><span><i class="credit"></i> Credit</span
        ><small>September 2026 · weekly totals</small>
      </div>
    }
    <svg
      viewBox="0 0 600 180" preserveAspectRatio="none"
      role="img"
      aria-label="Weekly debit and credit totals for September 2026. Exact values are listed below."
    >
      <defs>
        <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
          <stop stop-color="#24ddc6" stop-opacity=".22" />
          <stop offset="1" stop-color="#24ddc6" stop-opacity="0" />
        </linearGradient>
      </defs>
      @for (y of [25, 70, 115, 160]; track y) {
        <line
          x1="40"
          x2="580"
          [attr.y1]="y"
          [attr.y2]="y"
          stroke="#23414b"
          stroke-dasharray="3 5"
        />
      }
      <polygon [attr.points]="'50,170 ' + debitPoints() + ' 570,170'" fill="url(#chart-fill)" />
      <polyline
        [attr.points]="debitPoints()"
        fill="none"
        stroke="#31dfcb"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <polyline
        [attr.points]="creditPoints()"
        fill="none"
        stroke="#569ee8"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg><div class="chart-axis">@for(week of weeks;track week){<span>{{week}}</span>}</div>
    @if (!compact()) {
      <details>
        <summary>View chart data</summary>
        <table>
          <caption class="sr-only">
            Weekly totals in EUR
          </caption>
          <thead>
            <tr>
              <th>Week</th>
              <th>Debit (€)</th>
              <th>Credit (€)</th>
            </tr>
          </thead>
          <tbody>
            @for (week of weeks; track week; let i = $index) {
              <tr>
                <td>{{ week }}</td>
                <td>{{ (series().debit[i] / 100).toFixed(2) }}</td>
                <td>{{ (series().credit[i] / 100).toFixed(2) }}</td>
              </tr>
            }
          </tbody>
        </table>
      </details>
    }
  `,
  styles: `
    :host {display:flex;flex-direction:column;min-height:0;}
    .chart-key {
      display: flex;
      gap: 18px;
      align-items: center;
      font-size: 10px;
      color: var(--muted);
    }
    .chart-key span {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .chart-key small {
      margin-left: auto;
    }
    i {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--accent);
    }
    .credit {
      background: #569ee8;
    }
    svg {
      width: 100%;
      height: var(--trend-height, 180px);
      flex:1;
      min-height: 0;
      display: block;
      margin-top: 5px;
    }
    details {
      font-size: 11px;
      color: var(--muted);
    }
    .chart-key,details,.chart-axis {flex-shrink:0;line-height:12px;}
    .chart-axis{display:flex;justify-content:space-between;font-size:8px;color:var(--muted);padding:0 5%;margin-bottom:3px;}
    :host(.compact) .chart-axis{font-size:6px;}
    summary {
      cursor: pointer;
    }
    @media (max-width: 500px) {
      .chart-key small {
        display: none;
      }
    }
  `,
})
export class TrendComponent {
  private readonly store = inject(BankingStore);
  readonly compact = input(false);
  readonly weeks = ['01–07', '08–14', '15–21', '22–28', '29–30'];
  readonly series = computed(() => {
    const debit = [0, 0, 0, 0, 0];
    const credit = [0, 0, 0, 0, 0];
    for (const entry of this.store.transactions()) {
      if (!entry.date.startsWith('2026-09')) continue;
      const week = Math.min(4, Math.floor((Number(entry.date.slice(-2)) - 1) / 7));
      (entry.type === 'Debit' ? debit : credit)[week] += entry.amountCents;
    }
    return { debit, credit, max: Math.max(...debit, ...credit, 1) };
  });
  readonly debitPoints = computed(() => this.points(this.series().debit));
  readonly creditPoints = computed(() => this.points(this.series().credit));
  private points(values: number[]): string {
    return values
      .map((value, i) => `${50 + i * 130},${170 - (value / this.series().max) * 145}`)
      .join(' ');
  }
}
