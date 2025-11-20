/**
 * Fraction Math Utilities for Carpentry Quest
 * Handles conversions and calculations with fractions commonly used in carpentry
 */

export interface Fraction {
  whole: number;
  numerator: number;
  denominator: number;
}

/**
 * Find the Greatest Common Divisor using Euclidean algorithm
 */
export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

/**
 * Reduce a fraction to its simplest form
 */
export function reduceFraction(numerator: number, denominator: number): { numerator: number; denominator: number } {
  const divisor = gcd(numerator, denominator);
  return {
    numerator: numerator / divisor,
    denominator: denominator / divisor,
  };
}

/**
 * Convert decimal to fraction
 * Focuses on common carpentry fractions (denominators of 2, 4, 8, 16, 32)
 */
export function decimalToFraction(decimal: number): Fraction {
  const whole = Math.floor(decimal);
  const remainder = decimal - whole;

  if (remainder === 0) {
    return { whole, numerator: 0, denominator: 1 };
  }

  // Try common carpentry denominators
  const commonDenominators = [2, 4, 8, 16, 32, 64];

  for (const denom of commonDenominators) {
    const num = Math.round(remainder * denom);
    const actualValue = num / denom;

    // Check if it's close enough (within 0.001)
    if (Math.abs(actualValue - remainder) < 0.001) {
      const reduced = reduceFraction(num, denom);
      return {
        whole,
        numerator: reduced.numerator,
        denominator: reduced.denominator,
      };
    }
  }

  // Fallback: use 64ths if nothing else works
  const num = Math.round(remainder * 64);
  const reduced = reduceFraction(num, 64);
  return {
    whole,
    numerator: reduced.numerator,
    denominator: reduced.denominator,
  };
}

/**
 * Convert fraction to decimal
 */
export function fractionToDecimal(fraction: Fraction): number {
  return fraction.whole + (fraction.numerator / fraction.denominator);
}

/**
 * Parse fraction string like "3-5/8" or "5/8" or "3.625"
 */
export function parseFraction(input: string): Fraction | null {
  input = input.trim();

  // Check if it's a decimal
  if (input.includes('.')) {
    const decimal = parseFloat(input);
    if (isNaN(decimal)) return null;
    return decimalToFraction(decimal);
  }

  // Check for mixed fraction like "3-5/8" or "3 5/8"
  const mixedMatch = input.match(/^(\d+)[\s\-](\d+)\/(\d+)$/);
  if (mixedMatch) {
    const whole = parseInt(mixedMatch[1]);
    const numerator = parseInt(mixedMatch[2]);
    const denominator = parseInt(mixedMatch[3]);
    return { whole, numerator, denominator };
  }

  // Check for simple fraction like "5/8"
  const simpleMatch = input.match(/^(\d+)\/(\d+)$/);
  if (simpleMatch) {
    const numerator = parseInt(simpleMatch[1]);
    const denominator = parseInt(simpleMatch[2]);
    return { whole: 0, numerator, denominator };
  }

  // Check for whole number
  const wholeMatch = input.match(/^(\d+)$/);
  if (wholeMatch) {
    const whole = parseInt(wholeMatch[1]);
    return { whole, numerator: 0, denominator: 1 };
  }

  return null;
}

/**
 * Format fraction as string like "3-5/8" or "5/8"
 */
export function formatFraction(fraction: Fraction): string {
  if (fraction.numerator === 0) {
    return fraction.whole.toString();
  }

  if (fraction.whole === 0) {
    return `${fraction.numerator}/${fraction.denominator}`;
  }

  return `${fraction.whole}-${fraction.numerator}/${fraction.denominator}`;
}

/**
 * Add two fractions
 */
export function addFractions(a: Fraction, b: Fraction): Fraction {
  const decimalResult = fractionToDecimal(a) + fractionToDecimal(b);
  return decimalToFraction(decimalResult);
}

/**
 * Subtract two fractions
 */
export function subtractFractions(a: Fraction, b: Fraction): Fraction {
  const decimalResult = fractionToDecimal(a) - fractionToDecimal(b);
  return decimalToFraction(decimalResult);
}

/**
 * Multiply two fractions
 */
export function multiplyFractions(a: Fraction, b: Fraction): Fraction {
  const decimalResult = fractionToDecimal(a) * fractionToDecimal(b);
  return decimalToFraction(decimalResult);
}

/**
 * Divide two fractions
 */
export function divideFractions(a: Fraction, b: Fraction): Fraction {
  const decimalResult = fractionToDecimal(a) / fractionToDecimal(b);
  return decimalToFraction(decimalResult);
}
