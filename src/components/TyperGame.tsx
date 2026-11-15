import React, { useState, useEffect, useRef, useCallback } from 'react';
import { click, beep } from '../terminal/sound';

const HI_KEY = 'enesaks.typer.hi';
const WORDS = [
  'docker', 'kubectl', 'terraform', 'ansible', 'nginx', 'jenkins', 'grafana', 'prometheus', 'helm', 'bash',
  'linux', 'git', 'aws', 'ec2', 's3', 'iam', 'vpc', 'lambda', 'pipeline', 'deploy', 'rollback', 'cluster',
  'node', 'pod', 'container', 'image', 'registry', 'ingress', 'systemd', 'cron', 'ssh', 'sudo', 'grep', 'awk',
  'sed', 'curl', 'chmod', 'yaml', 'json', 'redis', 'postgres', 'kafka', 'vault', 'argocd', 'istio', 'commit',
  'merge', 'rebase', 'branch', 'backup', 'restore', 'uptime', 'latency', 'alert', 'metric', 'secret', 'volume',
  'subnet', 'proxy', 'daemon', 'kernel', 'socket', 'shell', 'script', 'build', 'release', 'canary', 'scale',
];

interface Word { id: number; text: string; x: number; y: number; speed: number }
interface Game { words: Word[]; target: number | null; typed: number; score: number; lives: number; nextSpawn: number; nextId: number }

const newGame = (): Game => ({ words: [], target: null, typed: 0, score: 0, lives: 3, nextSpawn: 0, nextId: 1 });
const readHi = () => { try { return Number(localStorage.getItem(HI_KEY)) || 0; } catch { return 0; } };
const writeHi = (n: number) => { try { localStorage.setItem(HI_KEY, String(n)); } catch { /* storage unavailable */ } };
const pad = (n: number) => String(n).padStart(3, '0');
const levelFor = (score: number) => 1 + Math.floor(score / 40);

/** Words rain down the screen; type one to shoot it before it reaches the bottom line. */
const TyperGame: React.FC<{ onQuit: () => void }> = ({ onQuit }) => {
  const game = useRef<Game>(newGame());
  const overRef = useRef(false);
  const fieldRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [, setFrame] = useState(0);
  const [over, setOver] = useState(false);
  const [hi, setHi] = useState(readHi);

  const restart = useCallback(() => {
    game.current = newGame();
    overRef.current = false;
    setOver(false);
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    let raf = 0;
    let last = 0;
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, last ? (t - last) / 1000 : 0);
      last = t;
      const g = game.current;
      const field = fieldRef.current;
      if (!field || overRef.current) return;
      const height = field.clientHeight;
      const level = levelFor(g.score);

      if (t >= g.nextSpawn && g.words.length < 9) {
        const used = new Set(g.words.map(w => w.text[0]));
        const pool = WORDS.filter(w => !used.has(w[0]));
        const text = (pool.length ? pool : WORDS)[Math.floor(Math.random() * (pool.length || WORDS.length))];
        const fallSeconds = Math.max(5, 13 - level * 0.8) * (0.9 + Math.random() * 0.25);
        g.words.push({ id: g.nextId++, text, x: Math.random(), y: -24, speed: height / fallSeconds });
        g.nextSpawn = t + Math.max(650, 1900 - level * 130);
      }

      for (const w of g.words) w.y += w.speed * dt;
      const landed = g.words.filter(w => w.y >= height - 26);
      if (landed.length) {
        g.words = g.words.filter(w => w.y < height - 26);
        if (landed.some(w => w.id === g.target)) { g.target = null; g.typed = 0; }
        g.lives -= landed.length;
        beep(220);
        if (g.lives <= 0) {
          g.lives = 0;
          overRef.current = true;
          setOver(true);
          setHi(prev => { const best = Math.max(prev, g.score); if (best > prev) writeHi(best); return best; });
        }
      }
      setFrame(f => (f + 1) % 1e6);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const type = (ch: string) => {
    const g = game.current;
    if (overRef.current || !/^[a-z0-9]$/.test(ch)) return;
    let target = g.words.find(w => w.id === g.target);
    if (!target) {
      // lock on to the lowest word starting with this letter
      target = g.words.filter(w => w.text[0] === ch).sort((a, b) => b.y - a.y)[0];
      if (!target) { beep(160); return; }
      g.target = target.id;
      g.typed = 0;
    }
    if (target.text[g.typed] !== ch) { beep(160); return; }
    g.typed++;
    click();
    if (g.typed >= target.text.length) {
      g.score += target.text.length;
      g.words = g.words.filter(w => w.id !== target!.id);
      g.target = null;
      g.typed = 0;
      beep(1320);
    }
  };

  useEffect(() => { inputRef.current?.focus({ preventScroll: true }); }, []);

  const g = game.current;
  const targetWord = g.words.find(w => w.id === g.target);

  return (
    <div className="typer" onPointerDown={() => setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 0)}>
      <div className="snake-hud">
        <span className="c-bright">TYPER</span>
        <span>SCORE <span className="c-bright">{pad(g.score)}</span></span>
        <span>HI <span className="c-amber">{pad(Math.max(hi, g.score))}</span></span>
        <span>LVL <span className="c-cyan">{levelFor(g.score)}</span></span>
        <span className="c-red">{'♥'.repeat(g.lives)}<span className="c-dim">{'♥'.repeat(3 - g.lives)}</span></span>
        <span className="snake-actions">
          <button type="button" className="cmd-link c-red" onClick={onQuit}>[ESC]çık</button>
        </span>
      </div>

      <div className="typer-field" ref={fieldRef}>
        {g.words.map(w => {
          const locked = w.id === g.target;
          return (
            <span
              key={w.id}
              className={`typer-word${locked ? ' locked' : ''}`}
              style={{ left: `${w.x * 100}%`, transform: `translate(${-w.x * 100}%, ${w.y}px)` }}
            >
              {locked ? <><span className="typer-hit">{w.text.slice(0, g.typed)}</span>{w.text.slice(g.typed)}</> : w.text}
            </span>
          );
        })}
        <div className="typer-line" />

        {over && (
          <div className="snake-overlay">
            <div className="snake-title c-red">GAME OVER</div>
            <div>SCORE {pad(g.score)}{g.score > 0 && g.score >= hi ? <span className="c-amber">  ★ YENİ REKOR</span> : null}</div>
            <button type="button" className="cmd-link cursor-blink" onClick={restart}>&gt; yeniden başlamak için Enter ya da buraya dokun</button>
          </div>
        )}
      </div>

      <div className="snake-foot c-dim">
        <span>&gt; {targetWord ? <><span className="c-bright">{targetWord.text.slice(0, g.typed)}</span><span className="cursor">{' '}</span></> : <span className="cursor">{' '}</span>}</span>
        <span className="snake-keys">düşen komutu yaz · Backspace: hedefi bırak · Esc: çık</span>
      </div>

      <input
        ref={inputRef}
        className="typer-input"
        aria-label="Oyun girişi"
        value=""
        onChange={e => { for (const ch of e.target.value.toLowerCase()) type(ch); }}
        onKeyDown={e => {
          if (e.key === 'Escape') { e.preventDefault(); onQuit(); }
          else if (e.key === 'Enter' && overRef.current) { e.preventDefault(); restart(); }
          else if (e.key === 'Backspace') { game.current.target = null; game.current.typed = 0; }
        }}
        onBlur={() => setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 0)}
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
      />
    </div>
  );
};

export default TyperGame;
