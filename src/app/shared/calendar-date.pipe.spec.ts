import { CalendarDatePipe } from './calendar-date.pipe';

describe('CalendarDatePipe', () => {
  it('preserves date-only values instead of interpreting them as local midnight', () => {
    const pipe = new CalendarDatePipe();
    expect(pipe.transform('2026-09-28')).toBe('28 Sept 2026');
    expect(pipe.transform('2026-01-01')).toBe('01 Jan 2026');
  });
});
