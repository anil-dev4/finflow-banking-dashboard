import { toCsv } from './export.service';
describe('CSV export', () => {
  it('preserves commas, quotes, newlines and numeric values', () => {
    expect(toCsv([['A, B', 'Say "hello"', 'Two\nlines', 12.5]])).toBe(
      '"A, B","Say ""hello""","Two\nlines","12.5"',
    );
  });
  it('neutralises formulas in text while preserving negative numbers', () => {
    expect(toCsv([['=SUM(A1)', ' +CMD', '@test', '-text', -12]])).toBe(
      '"\'=SUM(A1)","\' +CMD","\'@test","\'-text","-12"',
    );
  });
});
