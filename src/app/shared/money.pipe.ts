import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'money' })
export class MoneyPipe implements PipeTransform {
  private readonly formatter = new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
  });
  transform(cents: number): string {
    return this.formatter.format(cents / 100);
  }
}
