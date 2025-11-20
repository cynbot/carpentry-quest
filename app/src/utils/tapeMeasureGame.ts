/**
 * Tape Measure Game Logic
 *
 * Generates measurement challenges and handles game mechanics
 */

export interface Measurement {
  position: number; // actual position in inches (decimal)
  answer: string; // correct answer as a fraction string
  options: string[]; // multiple choice options (including correct answer)
  maxInches: number; // how many inches to display on the tape
  difficulty: 'easy' | 'medium' | 'hard';
}

/**
 * Convert a decimal number to a fraction string
 * e.g., 1.5 -> "1-1/2", 2.25 -> "2-1/4"
 */
export function decimalToFraction(decimal: number, precision: number = 16): string {
  const whole = Math.floor(decimal);
  const fractional = decimal - whole;

  if (fractional === 0) {
    return whole.toString();
  }

  // Find the closest fraction
  const numerator = Math.round(fractional * precision);

  // Simplify the fraction
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(numerator, precision);
  const simplifiedNumerator = numerator / divisor;
  const simplifiedDenominator = precision / divisor;

  if (whole === 0) {
    return `${simplifiedNumerator}/${simplifiedDenominator}`;
  }

  return `${whole}-${simplifiedNumerator}/${simplifiedDenominator}`;
}

/**
 * Convert a fraction string to decimal
 * e.g., "1-1/2" -> 1.5, "3/4" -> 0.75
 */
export function fractionToDecimal(fraction: string): number {
  // Handle whole numbers
  if (!fraction.includes('/') && !fraction.includes('-')) {
    return parseFloat(fraction);
  }

  // Handle mixed numbers (e.g., "1-1/2")
  if (fraction.includes('-')) {
    const [wholePart, fractionPart] = fraction.split('-');
    const whole = parseFloat(wholePart);
    const [num, den] = fractionPart.split('/').map(Number);
    return whole + num / den;
  }

  // Handle simple fractions (e.g., "3/4")
  const [num, den] = fraction.split('/').map(Number);
  return num / den;
}

/**
 * Generate possible fractions based on difficulty
 */
function generateFractionOptions(difficulty: 'easy' | 'medium' | 'hard'): number[] {
  const fractions: number[] = [];

  if (difficulty === 'easy') {
    // Halves and quarters only
    for (let i = 0; i < 16; i++) {
      if (i % 4 === 0) {
        fractions.push(i / 16);
      }
    }
  } else if (difficulty === 'medium') {
    // Halves, quarters, and eighths
    for (let i = 0; i < 16; i++) {
      if (i % 2 === 0) {
        fractions.push(i / 16);
      }
    }
  } else {
    // All sixteenths
    for (let i = 0; i < 16; i++) {
      fractions.push(i / 16);
    }
  }

  return fractions;
}

/**
 * Generate a random measurement challenge
 */
export function generateMeasurement(difficulty: 'easy' | 'medium' | 'hard' = 'medium'): Measurement {
  const maxInches = difficulty === 'easy' ? 6 : difficulty === 'medium' ? 8 : 12;
  const fractionOptions = generateFractionOptions(difficulty);

  // Generate random whole number and fraction
  const whole = Math.floor(Math.random() * (maxInches - 1)) + (difficulty === 'easy' ? 1 : 0);
  const fractional = fractionOptions[Math.floor(Math.random() * fractionOptions.length)];
  const position = whole + fractional;

  const correctAnswer = decimalToFraction(position, 16);

  // Generate wrong options
  const wrongOptions: string[] = [];
  const usedPositions = new Set([position]);

  while (wrongOptions.length < 3) {
    const wrongWhole = Math.floor(Math.random() * maxInches);
    const wrongFractional = fractionOptions[Math.floor(Math.random() * fractionOptions.length)];
    const wrongPosition = wrongWhole + wrongFractional;

    // Make sure it's different from correct answer and other wrong answers
    if (!usedPositions.has(wrongPosition) && wrongPosition <= maxInches) {
      usedPositions.add(wrongPosition);
      wrongOptions.push(decimalToFraction(wrongPosition, 16));
    }
  }

  // Shuffle options
  const options = [correctAnswer, ...wrongOptions].sort(() => Math.random() - 0.5);

  return {
    position,
    answer: correctAnswer,
    options,
    maxInches,
    difficulty,
  };
}

/**
 * Check if an answer is correct
 */
export function checkAnswer(userAnswer: string, correctAnswer: string): boolean {
  return userAnswer === correctAnswer;
}

/**
 * Calculate score based on performance
 */
export function calculateScore(
  correct: number,
  incorrect: number,
  timeElapsed: number,
  difficulty: 'easy' | 'medium' | 'hard'
): number {
  const total = correct + incorrect;
  if (total === 0) return 0;

  const accuracy = correct / total;
  const baseScore = correct * 100;

  // Difficulty multiplier
  const difficultyMultiplier = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 1.5 : 2;

  // Time bonus (faster = better)
  const avgTimePerQuestion = timeElapsed / total;
  const timeBonus = avgTimePerQuestion < 3 ? 1.2 : avgTimePerQuestion < 5 ? 1.1 : 1;

  // Accuracy bonus
  const accuracyBonus = accuracy >= 0.9 ? 1.3 : accuracy >= 0.8 ? 1.15 : 1;

  return Math.floor(baseScore * difficultyMultiplier * timeBonus * accuracyBonus);
}

/**
 * Generate a batch of measurements for practice
 */
export function generateBatch(count: number, difficulty: 'easy' | 'medium' | 'hard' = 'medium'): Measurement[] {
  const measurements: Measurement[] = [];
  for (let i = 0; i < count; i++) {
    measurements.push(generateMeasurement(difficulty));
  }
  return measurements;
}
