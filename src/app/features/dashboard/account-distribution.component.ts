import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { BankingStore } from '../../core/banking.store';

@Component({
  selector:'app-account-distribution',
  changeDetection:ChangeDetectionStrategy.OnPush,
  template:`<div class="panel-heading"><h2>Account distribution</h2></div><div class="distribution"><div class="donut" [style.background]="distribution()"><div><strong>{{store.accounts().length}}</strong><span>accounts</span></div></div><ul>@for(type of types();track type.name){<li><i [class]="type.name"></i><span>{{type.name}}</span><strong>{{type.count}}</strong></li>}</ul></div>`,
  styles:`:host{display:flex;flex-direction:column;min-height:0}.panel-heading{margin-bottom:10px}.panel-heading h2{font-size:13px}.distribution{display:flex;align-items:center;justify-content:center;gap:18px;flex:1;min-height:0}.donut{width:clamp(86px,12dvh,145px);height:clamp(86px,12dvh,145px);border-radius:50%;padding:12px;flex-shrink:0}.donut>div{border-radius:50%;background:#0e232f;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center}.donut strong{font-size:25px;line-height:1.2}.donut span{font-size:9px;color:var(--muted)}ul{list-style:none;padding:0;margin:0;display:grid;gap:12px;font-size:10px;min-width:85px}li{display:flex;align-items:center;gap:7px;color:var(--muted)}li strong{margin-left:auto;color:var(--text);font-weight:500}li i{width:6px;height:6px;border-radius:50%;background:#29d7bf}li .Liability{background:#599ceb}li .Income{background:#9885ed}li .Expense{background:#e8bc76}@media(max-width:1150px){.distribution{gap:12px}ul{gap:10px;min-width:80px}}@media(max-width:899px){.distribution{padding:12px 0;gap:40px}.donut{width:130px;height:130px}}`,
})
export class AccountDistributionComponent {
  readonly store = inject(BankingStore);
  readonly types = computed(() => ['Asset','Liability','Income','Expense'].map(type => ({
    name:type,count:this.store.accounts().filter(account=>account.type === type).length,
  })));
  readonly distribution = computed(() => {
    let start = 0;
    const colours = ['#29d7bf','#599ceb','#9885ed','#e8bc76'];
    return 'conic-gradient(' + this.types().map((type,index) => {
      const end = start + type.count / this.store.accounts().length * 100;
      const segment = `${colours[index]} ${start}% ${end}%`;
      start = end;
      return segment;
    }).join(',') + ')';
  });
}
