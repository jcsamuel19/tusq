export function digitsOnly(input: string): string {
  return (input || '').replace(/\D+/g, '');
}

export function formatUSPhone(input: string): string {
  const digits = digitsOnly(input).slice(0, 10);
  const part1 = digits.slice(0, 3);
  const part2 = digits.slice(3, 6);
  const part3 = digits.slice(6, 10);
  if (digits.length <= 3) return part1;
  if (digits.length <= 6) return `(${part1}) ${part2}`;
  return `(${part1}) ${part2}-${part3}`;
}

export function isValidUSPhone(input: string): boolean {
  const digits = digitsOnly(input);
  return digits.length === 10;
}

export function toE164US(input: string): string | null {
  const digits = digitsOnly(input);
  if (digits.length !== 10) return null;
  return `+1${digits}`;
}


