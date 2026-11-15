import React, { useState, useEffect, useRef, useCallback } from 'react';

// Grid size: wide on desktop, tall on portrait phones (chosen once when the game opens).
let COLS = 32;
let ROWS = 20;
const HI_KEY = 'enesaks.snake.hi';

type Vec = { x: number; y: number };
type Status = 'playing' | 'paused' | 'over';
interface Game { snake: Vec[]; dir: Vec; queue: Vec[]; food: Vec; score: number }

const DIRS: Record<string, Vec> = {
  up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 },
};

const randomFood = (snake: Vec[]): Vec => {
  let f: Vec;
  do { f = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) }; }
  while (snake.some(s => s.x === f.x && s.y === f.y));
  return f;
};

const newGame = (): Game => {
  const snake = [{ x: 12, y: 10 }, { x: 11, y: 10 }, { x: 10, y: 10 }];
  return { snake, dir: DIRS.right, queue: [], food: randomFood(snake), score: 0 };
};

const readHi = () => { try { return Number(localStorage.getItem(HI_KEY)) || 0; } catch { return 0; } };
const writeHi = (n: number) => { try { localStorage.setItem(HI_KEY, String(n)); } catch { /* storage unavailable */ } };

/** Step interval in ms: starts relaxed, gets faster with every point. */
const speedFor = (score: number) => Math.max(62, 140 - score * 4);
const pad = (n: number) => String(n).padStart(3, '0');

interface SnakeGameProps {
  onQuit: () => void;
}

const SnakeGame: React.FC<SnakeGameProps> = ({ onQuit }) => {
  const game = useRef<Game>(newGame());
  const statusRef = useRef<Status>('playing');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const cellRef = useRef(16);
  const swipe = useRef<{ x: number; y: number } | null>(null);

  const [score, setScore] = useState(0);
  const [hi, setHi] = useState(readHi);
  const [status, setStatusState] = useState<Status>('playing');

  const setStatus = useCallback((s: Status) => { statusRef.current = s; setStatusState(s); }, []);

  const restart = useCallback(() => {
    game.current = newGame();
    setScore(0);
    setStatus('playing');
  }, [setStatus]);

  const togglePause = useCallback(() => {
    if (statusRef.current === 'over') return;
    setStatus(statusRef.current === 'paused' ? 'playing' : 'paused');
  }, [setStatus]);

  /** Queues a turn; ignores reversals and repeats so fast key presses never kill the snake. */
  const turn = useCallback((d: Vec) => {
    if (statusRef.current === 'over') return;
    if (statusRef.current === 'paused') setStatus('playing');
    const g = game.current;
    const last = g.queue[g.queue.length - 1] || g.dir;
    if (g.queue.length >= 2) return;
    if ((d.x === last.x && d.y === last.y) || (d.x === -last.x && d.y === -last.y)) return;
    g.queue.push(d);
  }, [setStatus]);

  /* Fit the board to the tube: square cells, as large as the space allows. */
  useEffect(() => {
    const board = boardRef.current;
    const canvas = canvasRef.current;
    if (!board || !canvas) return;
    const portrait = board.clientHeight > board.clientWidth * 1.15;
    COLS = portrait ? 20 : 32;
    ROWS = portrait ? 28 : 20;
    game.current = newGame();
    const fit = () => {
      const cell = Math.max(6, Math.floor(Math.min((board.clientWidth - 4) / COLS, (board.clientHeight - 4) / ROWS)));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cellRef.current = cell * dpr;
      canvas.width = COLS * cell * dpr;
      canvas.height = ROWS * cell * dpr;
      canvas.style.width = `${COLS * cell}px`;
      canvas.style.height = `${ROWS * cell}px`;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(board);
    return () => ro.disconnect();
  }, []);

  /* Game loop: logic advances on a timer, drawing happens every frame. */
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    let raf = 0;
    let last = 0;

    const step = () => {
      const g = game.current;
      g.dir = g.queue.shift() || g.dir;
      const head = { x: (g.snake[0].x + g.dir.x + COLS) % COLS, y: (g.snake[0].y + g.dir.y + ROWS) % ROWS };
      const grows = head.x === g.food.x && head.y === g.food.y;
      // The tail cell is free this step unless the snake is growing.
      const body = grows ? g.snake : g.snake.slice(0, -1);
      if (body.some(s => s.x === head.x && s.y === head.y)) {
        setStatus('over');
        setHi(prev => { const best = Math.max(prev, g.score); if (best > prev) writeHi(best); return best; });
        return;
      }
      g.snake.unshift(head);
      if (grows) { g.score++; setScore(g.score); g.food = randomFood(g.snake); }
      else g.snake.pop();
    };

    const draw = (t: number) => {
      const g = game.current;
      const c = cellRef.current;
      const gap = Math.max(1, Math.round(c * 0.1));
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // faint dot grid, like unlit character cells
      ctx.fillStyle = 'rgba(108, 245, 143, 0.13)';
      const dot = Math.max(1, Math.round(c * 0.08));
      for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) ctx.fillRect(x * c + c / 2 - dot / 2, y * c + c / 2 - dot / 2, dot, dot);

      // food pulses
      const fs = c * (0.62 + 0.2 * Math.sin(t / 160));
      ctx.shadowColor = '#ffcf5c';
      ctx.shadowBlur = c * 0.9;
      ctx.fillStyle = '#ffcf5c';
      ctx.fillRect(g.food.x * c + (c - fs) / 2, g.food.y * c + (c - fs) / 2, fs, fs);

      // snake: bright head, striped body
      ctx.shadowColor = '#5dff8a';
      ctx.shadowBlur = c * 0.7;
      const dead = statusRef.current === 'over';
      for (let i = g.snake.length - 1; i >= 0; i--) {
        const s = g.snake[i];
        ctx.fillStyle = dead ? '#ff7a6b' : i === 0 ? '#d3ffe0' : i % 2 ? '#54e87c' : '#44cf6c';
        ctx.fillRect(s.x * c + gap, s.y * c + gap, c - gap * 2, c - gap * 2);
      }
      ctx.shadowBlur = 0;
    };

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (statusRef.current === 'playing' && t - last >= speedFor(game.current.score)) { last = t; step(); }
      draw(t);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [setStatus]);

  /* Keyboard */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      const dir =
        k === 'arrowup' || k === 'w' ? DIRS.up :
        k === 'arrowdown' || k === 's' ? DIRS.down :
        k === 'arrowleft' || k === 'a' ? DIRS.left :
        k === 'arrowright' || k === 'd' ? DIRS.right : null;
      if (dir) { e.preventDefault(); turn(dir); return; }
      if (k === 'p' || k === ' ') { e.preventDefault(); togglePause(); }
      else if (k === 'r' || (k === 'enter' && statusRef.current === 'over')) { e.preventDefault(); restart(); }
      else if (k === 'escape' || k === 'q') onQuit();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onQuit, restart, togglePause, turn]);

  /* Pause when the tab is hidden so the snake does not die unattended. */
  useEffect(() => {
    const onHide = () => { if (document.hidden && statusRef.current === 'playing') setStatus('paused'); };
    document.addEventListener('visibilitychange', onHide);
    return () => document.removeEventListener('visibilitychange', onHide);
  }, [setStatus]);

  const onPointerUp = (e: React.PointerEvent) => {
    const start = swipe.current;
    swipe.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
    turn(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? DIRS.right : DIRS.left) : (dy > 0 ? DIRS.down : DIRS.up));
  };

  const level = 1 + Math.floor(score / 5);

  return (
    <div className="snake">
      <div className="snake-hud">
        <span className="c-bright">SNAKE</span>
        <span>SCORE <span className="c-bright">{pad(score)}</span></span>
        <span>HI <span className="c-amber">{pad(Math.max(hi, score))}</span></span>
        <span>LVL <span className="c-cyan">{level}</span></span>
        <span className="snake-actions">
          <button type="button" className="cmd-link" onClick={togglePause}>[P]{status === 'paused' ? 'devam' : 'duraklat'}</button>
          <button type="button" className="cmd-link" onClick={restart}>[R]yeniden</button>
          <button type="button" className="cmd-link c-red" onClick={onQuit}>[Q]çık</button>
        </span>
      </div>

      <div
        className="snake-board"
        ref={boardRef}
        onPointerDown={e => { swipe.current = { x: e.clientX, y: e.clientY }; }}
        onPointerUp={onPointerUp}
        onPointerCancel={() => { swipe.current = null; }}
      >
        <div className="snake-frame">
          <canvas ref={canvasRef} />
          {status !== 'playing' && (
            <div className="snake-overlay">
              {status === 'over' ? (
                <>
                  <div className="snake-title c-red">GAME OVER</div>
                  <div>SCORE {pad(score)}{score > 0 && score >= hi ? <span className="c-amber">  ★ YENİ REKOR</span> : null}</div>
                  <button type="button" className="cmd-link cursor-blink" onClick={restart}>&gt; yeniden başlamak için R ya da buraya dokun</button>
                </>
              ) : (
                <>
                  <div className="snake-title">PAUSED</div>
                  <button type="button" className="cmd-link" onClick={togglePause}>&gt; devam etmek için P ya da bir yön tuşu</button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="snake-foot c-dim">
        <span className="snake-keys">WASD / ok tuşları: yön · P: duraklat · duvarlardan geçilir · her 5 puanda seviye artar</span>
        <span className="snake-pad" aria-label="Yön tuşları">
          <button type="button" aria-label="Sol" onClick={() => turn(DIRS.left)}>◀</button>
          <button type="button" aria-label="Yukarı" onClick={() => turn(DIRS.up)}>▲</button>
          <button type="button" aria-label="Aşağı" onClick={() => turn(DIRS.down)}>▼</button>
          <button type="button" aria-label="Sağ" onClick={() => turn(DIRS.right)}>▶</button>
        </span>
      </div>
    </div>
  );
};

export default SnakeGame;
