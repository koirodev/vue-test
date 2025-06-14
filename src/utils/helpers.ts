export function isBlank(value: string | null | undefined): boolean {
  if (typeof value !== 'string') return false;
  return value.trim().startsWith('http') || value.trim().startsWith('//');
}

export function priceToString(price: number | null | undefined): string {
  if (typeof price !== 'number') return 'N/A';
  if (price <= 0) return 'Бесплатно';

  return price.toFixed(2).replace('.', ',');
}

export function toCaseCount(
  number: number,
  forms: [string, string, string]
): string {
  const cases = [2, 0, 1, 1, 1, 2];
  const mod100 = number % 100;
  const mod10 = number % 10;

  if (mod100 > 4 && mod100 < 20) {
    return forms[2];
  }

  return forms[cases[Math.min(mod10, 5)]];
}
