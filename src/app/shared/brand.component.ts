import { ChangeDetectionStrategy, Component } from '@angular/core';
@Component({
  selector: 'app-brand',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="brand"
    ><svg width="30" height="36" viewBox="0 0 30 36" aria-hidden="true">
      <path
        d="M0 9A9 9 0 0 1 9 0h21v5a5 5 0 0 1-5 5H10v5h13v5a5 5 0 0 1-5 5h-8v6a5 5 0 0 1-5 5H0Z"
        fill="currentColor"
      /></svg
    ><span>FinFlow<small>Banking Operations Platform</small></span></span
  >`,
  styles: `
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      color: var(--accent);
      font-size: 25px;
      font-weight: 750;
      letter-spacing: -1px;
    }
    .brand small {
      display: block;
      margin-top: 3px;
      color: var(--muted);
      font-size: 10px;
      font-weight: 400;
      letter-spacing: 0.25px;
    }
  `,
})
export class BrandComponent {}
