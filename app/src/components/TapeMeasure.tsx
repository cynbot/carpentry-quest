/**
 * Tape Measure Trainer
 *
 * Interactive tape measure training tool with multiple game modes.
 * Features: Tutorial, Speed Challenge, Accuracy Test
 */

import { useState, useEffect, useCallback } from 'react';
import { useProgress } from '../contexts/ProgressContext';
import { generateMeasurement, type Measurement } from '../utils/tapeMeasureGame';

type GameMode = 'menu' | 'tutorial' | 'speed' | 'accuracy';

interface GameStats {
  correct: number;
  incorrect: number;
  timeElapsed: number;
  measurements: number;
}

export function TapeMeasure() {
  const [gameMode, setGameMode] = useState<GameMode>('menu');
  const [currentMeasurement, setCurrentMeasurement] = useState<Measurement | null>(null);
  const [gameStats, setGameStats] = useState<GameStats>({
    correct: 0,
    incorrect: 0,
    timeElapsed: 0,
    measurements: 0,
  });
  const [startTime, setStartTime] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isGameActive, setIsGameActive] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const { awardXP, incrementStat, updateChallengeProgress } = useProgress();

  // Generate a new measurement challenge
  const generateNewChallenge = useCallback(() => {
    const difficulty = gameMode === 'tutorial' ? 'easy' : gameMode === 'speed' ? 'medium' : 'hard';
    const measurement = generateMeasurement(difficulty);
    setCurrentMeasurement(measurement);
    setSelectedAnswer(null);
    setFeedback(null);
  }, [gameMode]);

  // Start game
  const startGame = useCallback((mode: GameMode) => {
    setGameMode(mode);
    setGameStats({ correct: 0, incorrect: 0, timeElapsed: 0, measurements: 0 });
    setStartTime(Date.now());
    setIsGameActive(true);
    setFeedback(null);

    // Generate first challenge after a brief delay
    setTimeout(() => {
      const difficulty = mode === 'tutorial' ? 'easy' : mode === 'speed' ? 'medium' : 'hard';
      const measurement = generateMeasurement(difficulty);
      setCurrentMeasurement(measurement);
    }, 100);
  }, []);

  // End game
  const endGame = useCallback(() => {
    setIsGameActive(false);
    const timeElapsed = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;

    // Calculate accuracy
    const total = gameStats.correct + gameStats.incorrect;
    const accuracy = total > 0 ? (gameStats.correct / total) * 100 : 0;

    // Award XP based on performance
    let xpAmount = gameStats.correct * 5; // 5 XP per correct answer
    if (accuracy >= 90) xpAmount = Math.floor(xpAmount * 1.5); // Bonus for high accuracy
    if (gameMode === 'speed' && timeElapsed < 60) xpAmount = Math.floor(xpAmount * 1.2); // Speed bonus

    if (xpAmount > 0) {
      awardXP(xpAmount, `Tape Measure: ${gameMode}`);
    }

    // Update challenge progress
    updateChallengeProgress('tape-measure-beginner', gameStats.measurements);
    if (accuracy >= 90 && gameStats.measurements >= 20) {
      updateChallengeProgress('tape-measure-accuracy', accuracy);
    }
    if (gameMode === 'speed' && timeElapsed <= 30 && gameStats.measurements >= 10) {
      updateChallengeProgress('tape-measure-speed', timeElapsed);
    }

    // Update final stats with time
    setGameStats(prev => ({ ...prev, timeElapsed }));
  }, [gameStats, startTime, gameMode, awardXP, incrementStat, updateChallengeProgress]);

  // Handle answer selection
  const handleAnswer = useCallback((answer: string) => {
    if (!currentMeasurement || !isGameActive) return;

    setSelectedAnswer(answer);
    const isCorrect = answer === currentMeasurement.answer;

    setGameStats(prev => ({
      ...prev,
      correct: prev.correct + (isCorrect ? 1 : 0),
      incorrect: prev.incorrect + (isCorrect ? 0 : 1),
      measurements: prev.measurements + 1,
    }));

    if (isCorrect) {
      setFeedback({ message: '✓ Correct!', type: 'success' });

      // Generate new challenge after a brief delay
      setTimeout(() => {
        generateNewChallenge();
      }, 800);
    } else {
      setFeedback({
        message: `✗ Incorrect. The answer is ${currentMeasurement.answer}`,
        type: 'error'
      });

      // Show correct answer briefly, then move on
      setTimeout(() => {
        generateNewChallenge();
      }, 1500);
    }
  }, [currentMeasurement, isGameActive, generateNewChallenge]);

  // Timer effect
  useEffect(() => {
    if (!isGameActive || !startTime) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);

      // Auto-end game after time limits
      if (gameMode === 'tutorial' && elapsed >= 120) endGame(); // 2 min tutorial
      if (gameMode === 'speed' && elapsed >= 60) endGame(); // 1 min speed challenge
      if (gameMode === 'accuracy' && gameStats.measurements >= 20) endGame(); // 20 measurements for accuracy
    }, 100);

    return () => clearInterval(interval);
  }, [isGameActive, startTime, gameMode, gameStats.measurements, endGame]);

  const currentTime = startTime && isGameActive ? Math.floor((Date.now() - startTime) / 1000) : gameStats.timeElapsed;

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="bg-gray-800 rounded-lg shadow-2xl border-2 border-primary-red overflow-hidden">
        {/* Header */}
        <div className="bg-gray-900 p-6 border-b-2 border-primary-red">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            📏 Tape Measure Trainer
          </h2>
          <p className="text-metallic mt-2">
            Master reading tape measures with interactive challenges
          </p>
        </div>

        {/* Game Menu */}
        {gameMode === 'menu' && (
          <div className="p-8">
            <div className="grid gap-4 md:grid-cols-3">
              <button
                onClick={() => startGame('tutorial')}
                className="bg-gray-700 hover:bg-gray-600 p-6 rounded-lg border-2 border-metallic/30 hover:border-success transition-all text-left group"
              >
                <div className="text-4xl mb-3">🎓</div>
                <h3 className="text-xl font-bold text-white mb-2">Tutorial Mode</h3>
                <p className="text-metallic text-sm mb-3">
                  Learn the basics with easy measurements
                </p>
                <div className="text-sand text-sm">
                  • 2 minute session<br />
                  • Easy measurements (halves, quarters)<br />
                  • No time pressure
                </div>
              </button>

              <button
                onClick={() => startGame('speed')}
                className="bg-gray-700 hover:bg-gray-600 p-6 rounded-lg border-2 border-metallic/30 hover:border-warning transition-all text-left group"
              >
                <div className="text-4xl mb-3">⚡</div>
                <h3 className="text-xl font-bold text-white mb-2">Speed Challenge</h3>
                <p className="text-metallic text-sm mb-3">
                  Read as many as you can in 60 seconds
                </p>
                <div className="text-sand text-sm">
                  • 1 minute timer<br />
                  • Medium difficulty<br />
                  • Bonus XP for speed
                </div>
              </button>

              <button
                onClick={() => startGame('accuracy')}
                className="bg-gray-700 hover:bg-gray-600 p-6 rounded-lg border-2 border-metallic/30 hover:border-primary-red transition-all text-left group"
              >
                <div className="text-4xl mb-3">🎯</div>
                <h3 className="text-xl font-bold text-white mb-2">Accuracy Test</h3>
                <p className="text-metallic text-sm mb-3">
                  Precision matters - 20 challenging measurements
                </p>
                <div className="text-sand text-sm">
                  • 20 measurements<br />
                  • Hard difficulty (sixteenths)<br />
                  • Bonus XP for 90%+ accuracy
                </div>
              </button>
            </div>

            <div className="mt-8 p-6 bg-gray-900 rounded-lg border border-metallic/20">
              <h3 className="text-lg font-bold text-white mb-3">🎮 How to Play</h3>
              <ul className="text-metallic space-y-2 text-sm">
                <li>• Click on the tape measure where you see the red marker</li>
                <li>• Select the correct measurement from the options below</li>
                <li>• Earn XP and unlock achievements as you improve</li>
                <li>• Practice daily to build your streak!</li>
              </ul>
            </div>
          </div>
        )}

        {/* Active Game */}
        {gameMode !== 'menu' && isGameActive && currentMeasurement && (
          <div className="p-6">
            {/* Stats Bar */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-900 p-4 rounded-lg border border-metallic/20">
                <div className="text-metallic text-xs mb-1">Time</div>
                <div className="text-2xl font-bold text-white">{currentTime}s</div>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg border border-success/50">
                <div className="text-metallic text-xs mb-1">Correct</div>
                <div className="text-2xl font-bold text-success">{gameStats.correct}</div>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg border border-warning/50">
                <div className="text-metallic text-xs mb-1">Incorrect</div>
                <div className="text-2xl font-bold text-warning">{gameStats.incorrect}</div>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg border border-primary-red/50">
                <div className="text-metallic text-xs mb-1">
                  {gameMode === 'accuracy' ? 'Progress' : 'Total'}
                </div>
                <div className="text-2xl font-bold text-primary-red">
                  {gameMode === 'accuracy' ? `${gameStats.measurements}/20` : gameStats.measurements}
                </div>
              </div>
            </div>

            {/* Measurement Display */}
            <div className="bg-gray-900 p-6 rounded-lg mb-6 border-2 border-primary-red">
              <div className="text-center mb-4">
                <div className="text-sand text-sm mb-2">Read this measurement:</div>
              </div>

              {/* SVG Tape Measure */}
              <TapeMeasureSVG
                position={currentMeasurement.position}
                maxInches={currentMeasurement.maxInches}
              />
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {currentMeasurement.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  disabled={selectedAnswer !== null}
                  className={`p-4 rounded-lg font-bold text-lg transition-all border-2 ${
                    selectedAnswer === option
                      ? option === currentMeasurement.answer
                        ? 'bg-success border-success text-white'
                        : 'bg-warning border-warning text-white'
                      : 'bg-gray-700 border-metallic/30 hover:border-primary-red text-white hover:bg-gray-600'
                  } disabled:cursor-not-allowed`}
                >
                  {option}
                </button>
              ))}
            </div>

            {/* Feedback */}
            {feedback && (
              <div className={`p-4 rounded-lg text-center font-bold text-lg mb-6 ${
                feedback.type === 'success'
                  ? 'bg-success/20 border-2 border-success text-success'
                  : 'bg-warning/20 border-2 border-warning text-warning'
              }`}>
                {feedback.message}
              </div>
            )}

            {/* End Game Button */}
            <button
              onClick={endGame}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg border border-metallic/30 transition-all"
            >
              End Session
            </button>
          </div>
        )}

        {/* Results Screen */}
        {gameMode !== 'menu' && !isGameActive && (
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">
                {((gameStats.correct / (gameStats.correct + gameStats.incorrect)) * 100 >= 80) ? '🏆' : '📊'}
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">Session Complete!</h3>
              <p className="text-metallic">
                {gameMode === 'tutorial' && 'Great practice session!'}
                {gameMode === 'speed' && 'Time\'s up!'}
                {gameMode === 'accuracy' && 'Accuracy test complete!'}
              </p>
            </div>

            {/* Results Stats */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-900 p-6 rounded-lg border border-metallic/20 text-center">
                <div className="text-metallic mb-2">Accuracy</div>
                <div className="text-4xl font-bold text-primary-red">
                  {gameStats.correct + gameStats.incorrect > 0
                    ? Math.round((gameStats.correct / (gameStats.correct + gameStats.incorrect)) * 100)
                    : 0}%
                </div>
              </div>
              <div className="bg-gray-900 p-6 rounded-lg border border-metallic/20 text-center">
                <div className="text-metallic mb-2">Measurements</div>
                <div className="text-4xl font-bold text-success">{gameStats.measurements}</div>
              </div>
              <div className="bg-gray-900 p-6 rounded-lg border border-metallic/20 text-center">
                <div className="text-metallic mb-2">Time</div>
                <div className="text-4xl font-bold text-warning">{gameStats.timeElapsed}s</div>
              </div>
            </div>

            {/* Breakdown */}
            <div className="bg-gray-900 p-6 rounded-lg mb-6 border border-metallic/20">
              <div className="flex justify-between items-center mb-3">
                <span className="text-metallic">Correct Answers</span>
                <span className="text-success font-bold text-xl">{gameStats.correct}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-metallic">Incorrect Answers</span>
                <span className="text-warning font-bold text-xl">{gameStats.incorrect}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => startGame(gameMode as 'tutorial' | 'speed' | 'accuracy')}
                className="flex-1 bg-primary-red hover:bg-red-700 text-white font-bold py-4 rounded-lg transition-all"
              >
                Play Again
              </button>
              <button
                onClick={() => setGameMode('menu')}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 rounded-lg transition-all"
              >
                Main Menu
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * SVG Tape Measure Component
 * Renders an interactive tape measure visualization
 */
interface TapeMeasureSVGProps {
  position: number; // position in inches (can be fractional)
  maxInches: number; // how many inches to show on the tape
}

function TapeMeasureSVG({ position, maxInches }: TapeMeasureSVGProps) {
  const width = 800;
  const height = 120;
  const pixelsPerInch = width / maxInches;

  // Generate tick marks for the tape measure
  const ticks: Array<{ x: number; height: number; label?: string }> = [];

  for (let i = 0; i <= maxInches; i++) {
    // Inch marks
    ticks.push({ x: i * pixelsPerInch, height: 40, label: i.toString() });

    // Fraction marks
    for (let j = 1; j < 16; j++) {
      const fraction = j / 16;
      const x = (i + fraction) * pixelsPerInch;

      // Varying heights for different fractions
      let tickHeight = 10;
      if (j === 8) tickHeight = 30; // 1/2
      else if (j % 4 === 0) tickHeight = 25; // 1/4, 3/4
      else if (j % 2 === 0) tickHeight = 18; // 1/8, 3/8, etc.

      ticks.push({ x, height: tickHeight });
    }
  }

  // Calculate marker position
  const markerX = position * pixelsPerInch;

  return (
    <div className="overflow-x-auto">
      <svg
        width={width}
        height={height}
        className="mx-auto"
        style={{ minWidth: '600px' }}
      >
        {/* Tape background */}
        <rect x="0" y="30" width={width} height="60" fill="#F4E5C2" stroke="#2C3E50" strokeWidth="2" />

        {/* Tick marks */}
        {ticks.map((tick, idx) => (
          <g key={idx}>
            <line
              x1={tick.x}
              y1={90 - tick.height}
              x2={tick.x}
              y2={90}
              stroke="#2C3E50"
              strokeWidth={tick.height > 25 ? 2 : 1}
            />
            {tick.label && (
              <text
                x={tick.x}
                y={50}
                textAnchor="middle"
                fill="#2C3E50"
                fontSize="14"
                fontWeight="bold"
              >
                {tick.label}
              </text>
            )}
          </g>
        ))}

        {/* Marker - Red arrow pointing to the measurement */}
        <g transform={`translate(${markerX}, 0)`}>
          {/* Arrow */}
          <path
            d="M 0,15 L -8,25 L 8,25 Z"
            fill="#C41E3A"
            stroke="#2C3E50"
            strokeWidth="2"
          />
          {/* Line down to tape */}
          <line
            x1="0"
            y1="25"
            x2="0"
            y2="90"
            stroke="#C41E3A"
            strokeWidth="3"
            strokeDasharray="4,2"
          />
          {/* Pulse circle for emphasis */}
          <circle
            cx="0"
            cy="60"
            r="8"
            fill="#C41E3A"
            opacity="0.6"
          >
            <animate
              attributeName="r"
              values="8;12;8"
              dur="1.5s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.6;0.3;0.6"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      </svg>
    </div>
  );
}
