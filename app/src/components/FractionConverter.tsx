import { useState } from 'react';
import {
  parseFraction,
  formatFraction,
  fractionToDecimal,
  addFractions,
  subtractFractions,
  multiplyFractions,
  divideFractions,
  type Fraction,
} from '../utils/fractionMath';

type Operation = 'add' | 'subtract' | 'multiply' | 'divide' | null;

export function FractionConverter() {
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [operation, setOperation] = useState<Operation>(null);
  const [result, setResult] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleConvert = () => {
    const fraction = parseFraction(input1);
    if (!fraction) {
      setResult('Invalid input');
      return;
    }

    const decimal = fractionToDecimal(fraction);
    const fractionStr = formatFraction(fraction);

    setResult(`${fractionStr} = ${decimal.toFixed(4)}"`);
    triggerSuccess();
  };

  const handleCalculate = () => {
    if (!operation) {
      setResult('Select an operation');
      return;
    }

    const frac1 = parseFraction(input1);
    const frac2 = parseFraction(input2);

    if (!frac1 || !frac2) {
      setResult('Invalid input');
      return;
    }

    let resultFraction: Fraction;

    switch (operation) {
      case 'add':
        resultFraction = addFractions(frac1, frac2);
        break;
      case 'subtract':
        resultFraction = subtractFractions(frac1, frac2);
        break;
      case 'multiply':
        resultFraction = multiplyFractions(frac1, frac2);
        break;
      case 'divide':
        resultFraction = divideFractions(frac1, frac2);
        break;
      default:
        return;
    }

    const resultStr = formatFraction(resultFraction);
    const resultDecimal = fractionToDecimal(resultFraction);
    setResult(`${resultStr} (${resultDecimal.toFixed(4)}")`);
    triggerSuccess();
  };

  const triggerSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 500);
  };

  const operationSymbols = {
    add: '+',
    subtract: '−',
    multiply: '×',
    divide: '÷',
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="card relative">
        {showSuccess && (
          <div className="absolute inset-0 bg-success/20 rounded-lg success-flash pointer-events-none" />
        )}

        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-primary-red rounded-full" />
          <h2 className="text-3xl font-bold">Fraction Converter</h2>
        </div>

        <p className="text-metallic mb-6">
          Convert between decimals and fractions, or perform calculations with fractions.
          Use formats like: <span className="text-sand font-mono">3.625</span>, <span className="text-sand font-mono">3-5/8</span>, or <span className="text-sand font-mono">5/8</span>
        </p>

        {/* Converter Mode */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-primary-red">Convert</h3>
          <div className="flex gap-4">
            <input
              type="text"
              value={input1}
              onChange={(e) => setInput1(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleConvert()}
              placeholder="Enter fraction or decimal"
              className="input flex-1 font-mono text-lg"
            />
            <button onClick={handleConvert} className="btn-primary">
              Convert
            </button>
          </div>
        </div>

        {/* Calculator Mode */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-primary-red">Calculate</h3>

          {/* First Input */}
          <div className="mb-3">
            <input
              type="text"
              value={input1}
              onChange={(e) => setInput1(e.target.value)}
              placeholder="First measurement"
              className="input w-full font-mono text-lg"
            />
          </div>

          {/* Operation Buttons */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            {(['add', 'subtract', 'multiply', 'divide'] as const).map((op) => (
              <button
                key={op}
                onClick={() => setOperation(op)}
                className={`py-3 px-4 rounded-lg font-bold text-xl transition-all ${
                  operation === op
                    ? 'bg-primary-red text-white'
                    : 'bg-gray-700 text-metallic hover:bg-gray-600'
                }`}
              >
                {operationSymbols[op]}
              </button>
            ))}
          </div>

          {/* Second Input */}
          <div className="mb-4">
            <input
              type="text"
              value={input2}
              onChange={(e) => setInput2(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCalculate()}
              placeholder="Second measurement"
              className="input w-full font-mono text-lg"
            />
          </div>

          <button onClick={handleCalculate} className="btn-primary w-full">
            Calculate
          </button>
        </div>

        {/* Result Display */}
        {result && (
          <div className="bg-gray-900 rounded-lg p-6 border-2 border-primary-red">
            <div className="text-sm text-metallic mb-1">Result:</div>
            <div className="text-2xl font-bold font-mono text-sand">{result}</div>
          </div>
        )}

        {/* Quick Reference */}
        <div className="mt-8 pt-6 border-t border-metallic/20">
          <h4 className="text-sm font-semibold text-metallic mb-3">Common Carpentry Fractions:</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-metallic font-mono">1/2"</span>
              <span className="text-sand">= 0.5"</span>
            </div>
            <div className="flex justify-between">
              <span className="text-metallic font-mono">1/4"</span>
              <span className="text-sand">= 0.25"</span>
            </div>
            <div className="flex justify-between">
              <span className="text-metallic font-mono">3/4"</span>
              <span className="text-sand">= 0.75"</span>
            </div>
            <div className="flex justify-between">
              <span className="text-metallic font-mono">1/8"</span>
              <span className="text-sand">= 0.125"</span>
            </div>
            <div className="flex justify-between">
              <span className="text-metallic font-mono">3/8"</span>
              <span className="text-sand">= 0.375"</span>
            </div>
            <div className="flex justify-between">
              <span className="text-metallic font-mono">5/8"</span>
              <span className="text-sand">= 0.625"</span>
            </div>
            <div className="flex justify-between">
              <span className="text-metallic font-mono">7/8"</span>
              <span className="text-sand">= 0.875"</span>
            </div>
            <div className="flex justify-between">
              <span className="text-metallic font-mono">1/16"</span>
              <span className="text-sand">= 0.0625"</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
