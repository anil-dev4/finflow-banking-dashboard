import { Pipe, PipeTransform } from '@angular/core';

/** Calendar dates have no local timezone; preserve their day in every browser locale. */
@Pipe({ name: 'calendarDate' })
export class CalendarDatePipe implements PipeTransform {
  private readonly formatter = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });

  transform(value: string): string {
    return this.formatter.format(new Date(`${value}T00:00:00Z`));
  }
}
