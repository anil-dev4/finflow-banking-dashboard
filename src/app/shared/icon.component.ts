import { ChangeDetectionStrategy, Component, input } from '@angular/core';

const ICON_PATHS = {
  shield: ['M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6Z', 'm9 12 2 2 4-4'],
  lock: ['M6 10h12v11H6Z', 'M8 10V7a4 4 0 0 1 8 0v3', 'M12 14v3'],
  chart: ['M5 20v-7', 'M12 20V8', 'M19 20V3'],
  file: ['M6 3h8l4 4v14H6Z', 'M14 3v5h4', 'M9 12h6', 'M9 16h6'],
  mail: ['M3 5h18v14H3Z', 'm3 5 9 8 9-8'],
  eye: ['M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z', 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6'],
  arrow: ['M4 12h16', 'm14 6 6 6-6 6'],
  bolt: ['m13 2-9 12h7l-1 8 10-13h-7Z'],
  search: ['M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14', 'm15 15 6 6'],
  calendar: ['M4 5h16v16H4Z', 'M8 3v5', 'M16 3v5', 'M4 11h16'],
  bell: ['M5 17h14l-2-3V9a5 5 0 0 0-10 0v5Z', 'M10 21h4'],
  home: ['m3 10 9-7 9 7', 'M5 9v12h14V9', 'M10 21v-7h4v7'],
  wallet: ['M3 5h17v15H3Z', 'M15 10h6v6h-6Z'],
  transfer: ['M3 7h17', 'm16 3 4 4-4 4', 'M21 17H4', 'm8 13-4 4 4 4'],
  settings: [
    'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8',
    'm9 3 6 0 1 3 3 1 2 5-2 5-3 1-1 3H9l-1-3-3-1-2-5 2-5 3-1Z',
  ],
} as const;

export type IconName = keyof typeof ICON_PATHS;

@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.7"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    @for (path of paths[name()]; track $index) {
      <path [attr.d]="path" />
    }
  </svg>`,
  styles: `
    :host {
      display: inline-flex;
      width: 1.2em;
      height: 1.2em;
      flex-shrink: 0;
      vertical-align: middle;
    }
    svg {
      width: 100%;
      height: 100%;
    }
  `,
})
export class IconComponent {
  readonly name = input.required<IconName>();
  readonly paths = ICON_PATHS;
}
