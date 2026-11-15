import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import './styles/App.css';

import SnakeGame from './components/SnakeGame';
import MatrixRain from './components/MatrixRain';
import HackMode from './components/HackMode';
import { BOOT } from './data/constants';
import { loadRemote } from './terminal/remote';
import { cwdLabel, cwdAbs, resolvePath, completePath, Kind } from './terminal/fs';
import {
  RunContext, About, Experience, Contact, Writings, Projects, ArticleFile, Ls, Tree, Neofetch, Help, LINKS,
} from './terminal/outputs';

const COMMANDS = [
  'about', 'cat', 'cd', 'clear', 'contact', 'crt', 'date', 'echo', 'exit', 'experience', 'hack', 'help', 'history',
  'hostname', 'ls', 'matrix', 'neofetch', 'open', 'projects', 'pwd', 'snake', 'tree', 'uname', 'uptime', 'whoami', 'writings',
];
const WINDOWS = ['about', 'writings', 'projects', 'contact', 'help'];
const HISTORY_KEY = 'enesaks.history';

type Program = null | 'snake' | 'matrix' | 'hack';
interface Line { id: number; node: React.ReactNode }

const reducedMotion = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const loadHistory = (): string[] => {
  try { const v = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); return Array.isArray(v) ? v.slice(-100) : []; }
  catch { return []; }
};
const saveHistory = (h: string[]) => { try { localStorage.setItem(HISTORY_KEY, JSON.stringify(h.slice(-100))); } catch { /* storage unavailable */ } };

const Prompt: React.FC<{ cwd: string }> = ({ cwd }) => (
  <span className="prompt"><span className="c-green">enes@enesaks</span>:<span className="c-blue">{cwdLabel(cwd)}</span>$ </span>
);

const BootLine: React.FC<{ text: string; cls: string }> = ({ text, cls }) => {
  const m = text.match(/^(\[\s*(?:OK|WARN)\s*\])(.*)$/);
  if (!m) return <div className={cls}>{text || ' '}</div>;
  return <div><span className={cls === 'warn' ? 'c-amber' : 'c-green'}>{m[1]}</span>{m[2]}</div>;
};

const Clock: React.FC = () => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id); }, []);
  const p = (n: number) => String(n).padStart(2, '0');
  return <>{p(now.getHours())}:{p(now.getMinutes())} {p(now.getDate())}.{p(now.getMonth() + 1)}.{String(now.getFullYear()).slice(2)}</>;
};

const App: React.FC = () => {
  const [lines, setLines] = useState<Line[]>([]);
  const [bootCount, setBootCount] = useState(0);
  const [booting, setBooting] = useState(true);
  const [cwd, setCwd] = useState('');
  const [input, setInput] = useState('');
  const [cursor, setCursor] = useState(0);
  const [focused, setFocused] = useState(false);
  const [program, setProgram] = useState<Program>(null);
  const [crt, setCrt] = useState(true);
  const [power, setPower] = useState(true);
  const [active, setActive] = useState('about');

  const cwdRef = useRef('');
  const histRef = useRef<string[]>(loadHistory());
  const histIdx = useRef(-1);
  const draft = useRef('');
  const idRef = useRef(0);
  const anchorRef = useRef<number | null>(null);   // id of the line a long output should start from
  const busyRef = useRef(false);
  const bootedRef = useRef(false);
  const startedAt = useRef(Date.now());
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const print = useCallback((...nodes: React.ReactNode[]) => {
    const fresh = nodes.map(node => ({ id: ++idRef.current, node }));
    anchorRef.current = fresh[0]?.id ?? null;
    setLines(prev => [...prev, ...fresh].slice(-500));
  }, []);

  const focusInput = useCallback(() => setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 30), []);

  /* ───────── command interpreter ───────── */
  const execute = useCallback((raw: string) => {
    const here = cwdRef.current;
    const echo = <div className="echo"><Prompt cwd={here} />{raw}</div>;
    const trimmed = raw.trim();
    histIdx.current = -1;
    draft.current = '';
    if (!trimmed) { print(echo); return; }

    const hist = histRef.current;
    if (hist[hist.length - 1] !== trimmed) { hist.push(trimmed); saveHistory(hist); }

    const [name, ...args] = trimmed.split(/\s+/);
    const cmd = name.toLowerCase();
    const out = (node: React.ReactNode) => print(echo, <div className="out">{node}</div>);
    const launch = (p: Program) => { print(echo); setProgram(p); inputRef.current?.blur(); };

    switch (cmd) {
      case 'help': case '?': setActive('help'); return out(<Help />);
      case 'about': setActive('about'); return out(<About />);
      case 'experience': return out(<Experience />);
      case 'writings': case 'blog': setActive('writings'); return out(<Writings />);
      case 'projects': setActive('projects'); return out(<Projects />);
      case 'contact': setActive('contact'); return out(<Contact />);

      case 'clear': setLines([]); return;
      case 'pwd': return out(cwdAbs(here));
      case 'whoami': return out('enes');
      case 'hostname': return out('enesaks.com');
      case 'date': return out(new Date().toString());
      case 'uname': return out(args.some(a => a.includes('a')) ? 'Linux enesaks.com 6.8.0-enesaksu #1 SMP x86_64 GNU/Linux' : 'Linux');
      case 'echo': return out(trimmed.slice(4).trim().replace(/^(["'])(.*)\1$/, '$2') || ' ');
      case 'tree': return out(<Tree />);
      case 'neofetch': return out(<Neofetch uptime={uptime(startedAt.current)} />);
      case 'uptime': return out(` ${new Date().toLocaleTimeString('tr-TR')} up ${uptime(startedAt.current)},  1 user,  load average: 0.08, 0.03, 0.01`);

      case 'history':
        return out(<div className="pre">{hist.map((h, i) => <div key={i}><span className="c-dim">{String(i + 1).padStart(4, ' ')}</span>  {h}</div>)}</div>);

      case 'ls': case 'll': case 'dir': {
        const flags = args.filter(a => a.startsWith('-')).join('');
        const target = args.find(a => !a.startsWith('-'));
        const r = target ? resolvePath(here, target) : { ok: true as const, dir: here, entry: undefined };
        if (!r.ok) return out(`ls: cannot access '${target}': No such file or directory`);
        return out(<Ls dir={r.dir} long={cmd === 'll' || flags.includes('l')} all={flags.includes('a')} only={r.entry} />);
      }

      case 'cd': {
        const target = args[0];
        const r = !target ? { ok: true as const, dir: '', entry: undefined } : resolvePath(here, target);
        if (!r.ok) return out(`bash: cd: ${target}: No such file or directory`);
        if (r.entry) return out(r.entry.kind === 'repo'
          ? `bash: cd: ${target}: uzak depo — tarayıcıda açmak için: open ${target}`
          : `bash: cd: ${target}: Not a directory`);
        cwdRef.current = r.dir;
        setCwd(r.dir);
        if (r.dir) setActive(r.dir);
        return print(echo);
      }

      case 'cat': case 'less': case 'more': {
        if (!args.length) return out(`${cmd}: missing operand`);
        return out(args.map((a, i) => {
          const r = resolvePath(here, a);
          if (!r.ok) return <div key={i}>{cmd}: {a}: No such file or directory</div>;
          const e = r.entry;
          if (!e || e.kind === 'repo') return <div key={i}>{cmd}: {a}: Is a directory</div>;
          if (e.article) return <ArticleFile key={i} article={e.article} />;
          if (e.name === 'about.txt') return <About key={i} />;
          if (e.name === 'experience.log') return <Experience key={i} />;
          if (e.name === 'contact.json') return <Contact key={i} />;
          return <div key={i} className="pre">{'#!/bin/bash\n# ASCII snake — WASD / ok tuşları, Q ile çık\nexec /usr/games/snake "$@"'}</div>;
        }));
      }

      case 'open': case 'xdg-open': {
        const target = args[0];
        if (!target) return out('open: kullanım: open github|linkedin|medium|instagram|mail|<dosya>|<URL>');
        let url = LINKS[target.toLowerCase()] || (/^https?:\/\//i.test(target) ? target : '');
        if (!url) {
          const r = resolvePath(here, target);
          if (r.ok && r.entry) url = r.entry.article?.url || r.entry.project?.url || '';
        }
        if (!url) return out(`open: ${target}: hedef bulunamadı`);
        window.open(url, '_blank', 'noopener');
        return out(<span>Opening <span className="c-cyan">{url}</span> ...</span>);
      }

      case 'crt': {
        const arg = (args[0] || '').toLowerCase();
        if (arg !== 'on' && arg !== 'off') return out('kullanım: crt on|off');
        setCrt(arg === 'on');
        return out(`crt efektleri: ${arg}`);
      }

      case 'snake': case './snake.sh': case 'snake.sh': return launch('snake');
      case 'matrix': case 'cmatrix': return launch('matrix');
      case 'hack': return launch('hack');

      case 'sudo': case 'su': return out('enes is not in the sudoers file.  This incident will be reported.');
      case 'rm': case 'mv': case 'touch': case 'mkdir': case 'cp': case 'nano': case 'vim': case 'vi':
        return out(`${cmd}: cannot modify '${args[args.length - 1] || '.'}': Read-only file system`);
      case 'exit': case 'logout': return out(<span>logout<br /><span className="c-dim">(bu oturum kapanmaz — çıkmak için sekmeyi kapat)</span></span>);

      default:
        return out(<span>bash: {name}: command not found<br /><span className="c-dim">komut listesi için: help</span></span>);
    }
  }, [print]);

  /* Types a command into the prompt and runs it — used by clickable names and the status bar. */
  const typeAndRun = useCallback((cmd: string) => {
    if (busyRef.current || !bootedRef.current) return;
    if (reducedMotion()) { execute(cmd); focusInput(); return; }
    busyRef.current = true;
    let i = 0;
    const step = () => {
      i++;
      setInput(cmd.slice(0, i));
      setCursor(i);
      if (i < cmd.length) { setTimeout(step, 22); return; }
      setTimeout(() => {
        setInput(''); setCursor(0);
        busyRef.current = false;
        execute(cmd);
        focusInput();
      }, 160);
    };
    step();
  }, [execute, focusInput]);

  /* ───────── boot sequence ───────── */
  const finishBoot = useCallback(() => {
    if (bootedRef.current) return;
    bootedRef.current = true;
    print(
      ...BOOT.map(l => <BootLine text={l.text} cls={l.cls} />),
      <div>enesaks login: enes (automatic login)</div>,
      <div className="c-dim">Last login: {new Date().toString().slice(0, 24)} on tty1</div>,
      <div>{' '}</div>,
    );
    setBooting(false);
    setTimeout(() => typeAndRun('cat about.txt'), 300);
  }, [print, typeAndRun]);

  useEffect(() => {
    loadRemote();
    if (bootedRef.current) return;
    if (reducedMotion()) { finishBoot(); return; }
    const last = Math.max(...BOOT.map(l => l.t));
    const timers = BOOT.map((l, i) => setTimeout(() => setBootCount(i + 1), 900 + l.t));
    timers.push(setTimeout(finishBoot, 900 + last + 350));
    const skip = () => finishBoot();
    window.addEventListener('keydown', skip);
    window.addEventListener('pointerdown', skip);
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener('keydown', skip);
      window.removeEventListener('pointerdown', skip);
    };
  }, [finishBoot]);

  /* Keep the newest output in view; long outputs start from their command line instead of their end. */
  useLayoutEffect(() => {
    const box = scrollRef.current;
    if (!box) return;
    const anchor = anchorRef.current;
    anchorRef.current = null;
    const el = anchor != null ? box.querySelector<HTMLElement>(`[data-line="${anchor}"]`) : null;
    if (el && box.scrollHeight - el.offsetTop > box.clientHeight) box.scrollTop = el.offsetTop - 8;
    else box.scrollTop = box.scrollHeight;
  }, [lines, bootCount, booting]);
  useLayoutEffect(() => {
    const box = scrollRef.current;
    if (box && input) box.scrollTop = box.scrollHeight;
  }, [input]);

  /* ───────── keyboard ───────── */
  const setLine = (value: string) => { setInput(value); setCursor(value.length); };

  const complete = () => {
    const firstWord = /^\S*$/.test(input);
    const cut = input.lastIndexOf(' ');
    const head = firstWord ? '' : input.slice(0, cut + 1);
    const partial = firstWord ? input : input.slice(cut + 1);
    let base = '';
    let names: { name: string; kind: Kind | 'cmd' }[];
    if (firstWord && !input.startsWith('./') && !input.includes('/')) {
      if (!input) return;
      names = COMMANDS.filter(c => c.startsWith(input.toLowerCase())).map(name => ({ name, kind: 'cmd' as const }));
    } else {
      const r = completePath(cwdRef.current, partial.replace(/^\.\//, ''));
      base = (partial.startsWith('./') ? './' : '') + r.base;
      names = r.names;
    }
    if (!names.length) return;
    if (names.length === 1) {
      setLine(head + base + names[0].name + (names[0].kind === 'dir' ? '/' : ' '));
      return;
    }
    let common = names[0].name;
    for (const n of names) while (!n.name.startsWith(common)) common = common.slice(0, -1);
    if ((base + common).length > partial.length) { setLine(head + base + common); return; }
    print(
      <div className="echo"><Prompt cwd={cwdRef.current} />{input}</div>,
      <div className="out ls-grid">{names.map(n => <span key={n.name} className={n.kind === 'dir' || n.kind === 'repo' ? 'c-blue' : ''}>{n.name}{n.kind === 'dir' || n.kind === 'repo' ? '/' : ''}</span>)}</div>,
    );
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (busyRef.current) { e.preventDefault(); return; }
    const key = e.key.toLowerCase();

    if (e.ctrlKey && key === 'l') { e.preventDefault(); setLines([]); return; }
    if (e.ctrlKey && key === 'u') { e.preventDefault(); setLine(''); return; }
    if (e.ctrlKey && key === 'c') {
      if (window.getSelection()?.toString()) return;   // let the browser copy the selection
      e.preventDefault();
      print(<div className="echo"><Prompt cwd={cwdRef.current} />{input}^C</div>);
      setLine('');
      return;
    }
    if (e.key === 'Tab') { e.preventDefault(); complete(); return; }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const hist = histRef.current;
      if (!hist.length) return;
      if (histIdx.current === -1) { draft.current = input; histIdx.current = hist.length - 1; }
      else if (histIdx.current > 0) histIdx.current--;
      setLine(hist[histIdx.current]);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx.current === -1) return;
      const hist = histRef.current;
      if (histIdx.current >= hist.length - 1) { histIdx.current = -1; setLine(draft.current); }
      else { histIdx.current++; setLine(hist[histIdx.current]); }
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = input;
      setLine('');
      execute(value);
    }
  };

  const quitProgram = useCallback((message: string) => {
    setProgram(null);
    print(<div className="out c-dim">{message}</div>);
    focusInput();
  }, [print, focusInput]);
  const quitSnake = useCallback(() => quitProgram('[snake] oyun kapatıldı'), [quitProgram]);
  const quitMatrix = useCallback(() => quitProgram('[matrix] simulation ended'), [quitProgram]);
  const quitHack = useCallback(() => quitProgram('[hack] connection terminated'), [quitProgram]);

  const caret = Math.min(cursor, input.length);

  return (
    <div className={`room${crt ? '' : ' crt-off'}${power ? '' : ' power-off'}`}>
      <div className="monitor">
        <div className="screen">
          <div className="tube">
            <div className="viewport">
            <RunContext.Provider value={typeAndRun}>
              <div
                className="term"
                ref={scrollRef}
                onClick={() => { if (!window.getSelection()?.toString()) inputRef.current?.focus({ preventScroll: true }); }}
              >
                {booting && BOOT.slice(0, bootCount).map((l, i) => <BootLine key={i} text={l.text} cls={l.cls} />)}
                {lines.map(l => <div key={l.id} data-line={l.id}>{l.node}</div>)}

                {/* No prompt while a full-screen program owns the keyboard */}
                {!booting && !program && (
                  <div className="input-line">
                    <Prompt cwd={cwd} />
                    <span>{input.slice(0, caret)}</span>
                    <span className={`cursor${focused ? '' : ' idle'}`}>{input[caret] || ' '}</span>
                    <span>{input.slice(caret + 1)}</span>
                    <input
                      ref={inputRef}
                      className="ghost-input"
                      aria-label="Terminal komutu"
                      value={input}
                      onChange={e => { if (busyRef.current) return; setInput(e.target.value); setCursor(e.target.selectionStart ?? e.target.value.length); histIdx.current = -1; }}
                      onSelect={e => setCursor(e.currentTarget.selectionStart ?? input.length)}
                      onKeyDown={onKeyDown}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      autoComplete="off"
                      autoCapitalize="off"
                      autoCorrect="off"
                      spellCheck={false}
                    />
                  </div>
                )}
              </div>
            </RunContext.Provider>

            {program === 'snake' && <div className="program"><SnakeGame onQuit={quitSnake} /></div>}
            {program === 'matrix' && <div className="program"><MatrixRain onQuit={quitMatrix} /></div>}
            {program === 'hack' && <div className="program"><HackMode onQuit={quitHack} /></div>}
            </div>

            {/* tmux-style status bar: the clickable way around for visitors who would rather not type */}
            <div className="tmux">
              <span className="tmux-session">[enes]</span>
              <span className="tmux-windows">
                {program ? (
                  <button type="button" className="on">{WINDOWS.length}:{program}*</button>
                ) : WINDOWS.map((w, i) => (
                  <button key={w} type="button" className={active === w ? 'on' : ''} onClick={() => typeAndRun(w)}>
                    {i}:{w}{active === w ? '*' : ''}
                  </button>
                ))}
              </span>
              <span className="tmux-right">"enesaks" <Clock /></span>
            </div>
          </div>

          <div className="fx fx-scan" />
          <div className="fx fx-roll" />
          <div className="fx fx-flicker" />
          <div className="fx fx-glass" />
        </div>

        <div className="chin">
          <span className="brand">ENESAKS</span>
          <span className="model">EA-1401 · PHOSPHOR DISPLAY</span>
          <span className="knobs" aria-hidden="true"><i /><i /></span>
          <button type="button" className="power" aria-label={power ? 'Monitörü kapat' : 'Monitörü aç'} title="Güç" onClick={() => setPower(p => !p)}>
            <span className="led" />
          </button>
        </div>
      </div>
    </div>
  );
};

const uptime = (since: number) => {
  const s = Math.floor((Date.now() - since) / 1000);
  if (s < 60) return `${s} sec`;
  const m = Math.floor(s / 60);
  return m < 60 ? `${m} min` : `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;
};

export default App;
