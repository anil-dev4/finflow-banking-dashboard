import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { LedgerComponent } from './ledger.component';

describe('Ledger period balances', () => {
  it('carries earlier entries into the opening balance of a filtered period', () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParamMap: convertToParamMap({ account: '1001' }) } },
        },
      ],
    });
    const ledger = TestBed.runInInjectionContext(() => new LedgerComponent());
    ledger.from.set('2026-09-10');
    ledger.to.set('2026-09-20');
    expect(ledger.opening()).toBe(9425000);
    expect(ledger.entries().length).toBe(1);
    expect(ledger.closing()).toBe(11285000);
  });
  it('rejects a reversed date range', () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParamMap: convertToParamMap({}) } },
        },
      ],
    });
    const ledger = TestBed.runInInjectionContext(() => new LedgerComponent());
    ledger.from.set('2026-09-20');
    ledger.to.set('2026-09-01');
    expect(ledger.invalidRange()).toBeTrue();
    expect(ledger.entries()).toEqual([]);
  });
});
