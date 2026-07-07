import { describe, it, expect } from 'vitest';
import {
  gcd,
  reduceFraction,
  decimalToFraction,
  fractionToDecimal,
  parseFraction,
  formatFraction,
  addFractions,
  subtractFractions,
  multiplyFractions,
  divideFractions,
  type Fraction,
} from './fractionMath';

const frac = (whole: number, numerator = 0, denominator = 1): Fraction => ({
  whole,
  numerator,
  denominator,
});

describe('gcd / reduceFraction', () => {
  it('computes gcd', () => {
    expect(gcd(8, 12)).toBe(4);
    expect(gcd(7, 13)).toBe(1);
    expect(gcd(0, 5)).toBe(5);
  });

  it('reduces fractions', () => {
    expect(reduceFraction(8, 64)).toEqual({ numerator: 1, denominator: 8 });
    expect(reduceFraction(0, 4)).toEqual({ numerator: 0, denominator: 1 });
  });
});

describe('parseFraction', () => {
  it('parses mixed, simple, whole, and decimal forms', () => {
    expect(parseFraction('3-5/8')).toEqual(frac(3, 5, 8));
    expect(parseFraction('3 5/8')).toEqual(frac(3, 5, 8));
    expect(parseFraction('5/8')).toEqual(frac(0, 5, 8));
    expect(parseFraction('12')).toEqual(frac(12));
    expect(parseFraction('3.625')).toEqual(frac(3, 5, 8));
  });

  it('rejects garbage', () => {
    expect(parseFraction('')).toBeNull();
    expect(parseFraction('wood')).toBeNull();
    expect(parseFraction('3//8')).toBeNull();
  });
});

describe('formatFraction', () => {
  it('formats carpentry style', () => {
    expect(formatFraction(frac(3, 5, 8))).toBe('3-5/8');
    expect(formatFraction(frac(0, 5, 8))).toBe('5/8');
    expect(formatFraction(frac(3))).toBe('3');
  });

  it('formats negative results readably', () => {
    expect(formatFraction(frac(0, -1, 4))).toBe('-1/4');
    expect(formatFraction(frac(-1, -1, 4))).toBe('-1-1/4');
  });
});

describe('decimalToFraction', () => {
  it('snaps to common carpentry denominators', () => {
    expect(decimalToFraction(0.375)).toEqual(frac(0, 3, 8));
    expect(decimalToFraction(3.0625)).toEqual(frac(3, 1, 16));
  });

  it('round-trips through fractionToDecimal', () => {
    const original = frac(7, 13, 32);
    expect(decimalToFraction(fractionToDecimal(original))).toEqual(original);
  });
});

describe('exact arithmetic', () => {
  it('adds exactly, beyond 64th snapping', () => {
    // The old float implementation snapped 1/3 + 1/3 to 43/64.
    const third = frac(0, 1, 3);
    expect(addFractions(third, third)).toEqual(frac(0, 2, 3));
  });

  it('adds mixed numbers with carry', () => {
    expect(addFractions(frac(1, 3, 4), frac(0, 1, 2))).toEqual(frac(2, 1, 4));
  });

  it('subtracts into negative territory', () => {
    expect(subtractFractions(frac(0, 1, 4), frac(0, 1, 2))).toEqual(frac(0, -1, 4));
    expect(subtractFractions(frac(0, 1, 4), frac(1, 1, 2))).toEqual(frac(-1, -1, 4));
  });

  it('multiplies exactly', () => {
    // 1-1/2 × 2-1/2 = 3-3/4
    expect(multiplyFractions(frac(1, 1, 2), frac(2, 1, 2))).toEqual(frac(3, 3, 4));
    expect(multiplyFractions(frac(0, 1, 3), frac(0, 3, 1))).toEqual(frac(1));
  });

  it('divides exactly and refuses zero', () => {
    // 3-1/2 ÷ 2 = 1-3/4
    expect(divideFractions(frac(3, 1, 2), frac(2))).toEqual(frac(1, 3, 4));
    expect(divideFractions(frac(3, 1, 2), frac(0))).toBeNull();
  });

  it('reduces results', () => {
    expect(addFractions(frac(0, 1, 8), frac(0, 3, 8))).toEqual(frac(0, 1, 2));
  });
});
