import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';

/**
 * BUBBLE WARS EX ∞ UPGRADED
 * 
 * Design Philosophy: Neon Cyberpunk with Dynamic Motion
 * - High-contrast cyan/magenta/gold color scheme
 * - Aggressive typography with layered depth
 * - Fluid animations and particle effects
 * - Immersive full-screen game canvas
 */

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameRunning, setGameRunning] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [score, setScore] = useState(0);
  const [wave, setWave] = useState(1);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [gems, setGems] = useState(0);

  // Game state reference
  const gameStateRef = useRef({
    score: 0,
    wave: 1,
    lives: 3,
    level: 1,
    gems: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize game canvas
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Game loop
    let animationId: number;
    let frameCount = 0;

    const gameLoop = () => {
      frameCount++;

      // Clear canvas with gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#02030a');
      gradient.addColorStop(0.5, '#0a0515');
      gradient.addColorStop(1, '#02030a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw animated background elements
      drawBackgroundElements(ctx, canvas, frameCount);

      // Draw game title and info
      drawGameUI(ctx, canvas);

      if (gameRunning && !gamePaused) {
        // Update game state
        updateGameState();
      }

      animationId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [gameRunning, gamePaused]);

  const drawBackgroundElements = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    frameCount: number
  ) => {
    // Animated grid lines
    ctx.strokeStyle = 'rgba(0, 255, 231, 0.08)';
    ctx.lineWidth = 1;

    const gridSize = 60;
    const offset = (frameCount * 0.5) % gridSize;

    for (let x = -gridSize; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x + offset, 0);
      ctx.lineTo(x + offset - canvas.height, canvas.height);
      ctx.stroke();
    }

    // Floating neon circles
    const circles = [
      { x: canvas.width * 0.15, y: canvas.height * 0.2, r: 150, color: 'rgba(0, 255, 231, 0.1)' },
      { x: canvas.width * 0.85, y: canvas.height * 0.3, r: 120, color: 'rgba(192, 132, 252, 0.08)' },
      { x: canvas.width * 0.5, y: canvas.height * 0.8, r: 180, color: 'rgba(255, 45, 85, 0.08)' },
    ];

    circles.forEach((circle, i) => {
      const wobble = Math.sin((frameCount + i * 1000) * 0.005) * 20;
      ctx.fillStyle = circle.color;
      ctx.beginPath();
      ctx.arc(circle.x + wobble, circle.y + wobble, circle.r, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  const drawGameUI = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Main title with glow
    ctx.font = 'bold 72px "Orbitron", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Glow effect
    ctx.shadowColor = '#00ffe7';
    ctx.shadowBlur = 40;
    ctx.fillStyle = '#00ffe7';
    ctx.fillText('BUBBLE WARS EX ∞', centerX, centerY - 120);

    // Subtitle
    ctx.font = 'bold 24px "Orbitron", monospace';
    ctx.shadowColor = '#c084fc';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#c084fc';
    ctx.fillText('UPGRADED EDITION', centerX, centerY - 40);

    // Game stats
    ctx.font = '14px "Orbitron", monospace';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#ffd60a';
    ctx.textAlign = 'left';
    const statsX = centerX - 200;
    const statsY = centerY + 80;

    ctx.fillText(`SCORE: ${gameStateRef.current.score}`, statsX, statsY);
    ctx.fillText(`WAVE: ${gameStateRef.current.wave}`, statsX, statsY + 40);
    ctx.fillText(`LEVEL: ${gameStateRef.current.level}`, statsX, statsY + 80);
    ctx.fillText(`LIVES: ${gameStateRef.current.lives}`, statsX, statsY + 120);
    ctx.fillText(`💎 GEMS: ${gameStateRef.current.gems}`, statsX, statsY + 160);
  };

  const updateGameState = () => {
    // Simulate game progression
    gameStateRef.current.score += Math.floor(Math.random() * 10);
    setScore(gameStateRef.current.score);

    // Randomly trigger wave changes
    if (Math.random() < 0.001) {
      gameStateRef.current.wave += 1;
      setWave(gameStateRef.current.wave);
    }

    // Randomly trigger gem collection
    if (Math.random() < 0.005) {
      gameStateRef.current.gems += Math.floor(Math.random() * 5) + 1;
      setGems(gameStateRef.current.gems);
    }
  };

  const startGame = () => {
    setGameRunning(true);
    setGamePaused(false);
    gameStateRef.current = { score: 0, wave: 1, lives: 3, level: 1, gems: 0 };
    setScore(0);
    setWave(1);
    setLives(3);
    setLevel(1);
    setGems(0);
  };

  const togglePause = () => {
    setGamePaused(!gamePaused);
  };

  const resetGame = () => {
    setGameRunning(false);
    setGamePaused(false);
    gameStateRef.current = { score: 0, wave: 1, lives: 3, level: 1, gems: 0 };
    setScore(0);
    setWave(1);
    setLives(3);
    setLevel(1);
    setGems(0);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Game Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: 'block' }}
      />

      {/* Control Panel */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-4">
        {!gameRunning ? (
          <Button
            onClick={startGame}
            className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold px-8 py-3 rounded-lg flex items-center gap-2 transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/50"
          >
            <Play size={20} />
            START GAME
          </Button>
        ) : (
          <>
            <Button
              onClick={togglePause}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-200 hover:shadow-lg hover:shadow-yellow-500/50"
            >
              {gamePaused ? <Play size={20} /> : <Pause size={20} />}
              {gamePaused ? 'RESUME' : 'PAUSE'}
            </Button>
            <Button
              onClick={resetGame}
              className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-200 hover:shadow-lg hover:shadow-red-500/50"
            >
              <RotateCcw size={20} />
              RESET
            </Button>
          </>
        )}

        <Button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="bg-purple-500 hover:bg-purple-600 text-white font-bold px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/50"
        >
          {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </Button>
      </div>

      {/* HUD Display */}
      <div className="absolute top-8 left-8 z-40 font-mono text-cyan-400 text-sm space-y-2">
        <div className="border border-cyan-400 px-4 py-2 rounded">
          SCORE: {score.toString().padStart(8, '0')}
        </div>
        <div className="border border-purple-400 px-4 py-2 rounded text-purple-400">
          WAVE: {wave.toString().padStart(3, '0')}
        </div>
        <div className="border border-yellow-400 px-4 py-2 rounded text-yellow-400">
          LEVEL: {level.toString().padStart(2, '0')}
        </div>
      </div>

      {/* Status Display */}
      <div className="absolute top-8 right-8 z-40 font-mono text-right space-y-2">
        <div className="border border-red-400 px-4 py-2 rounded text-red-400">
          LIVES: {lives}
        </div>
        <div className="border border-yellow-400 px-4 py-2 rounded text-yellow-400">
          💎 GEMS: {gems}
        </div>
        <div className={`border px-4 py-2 rounded font-bold ${gameRunning ? (gamePaused ? 'border-yellow-400 text-yellow-400' : 'border-green-400 text-green-400') : 'border-gray-400 text-gray-400'}`}>
          {gameRunning ? (gamePaused ? '⏸ PAUSED' : '▶ RUNNING') : '⏹ STOPPED'}
        </div>
      </div>
    </div>
  );
}
