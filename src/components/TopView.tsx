import React, { useEffect, useState } from 'react';

interface Proc { pid: number; user: string; cpu: number; mem: number; command: string; base: number }

const PROCS: Proc[] = [
  { pid: 1,    user: 'root', cpu: 0, mem: 0.1, command: 'systemd',                       base: 0.2 },
  { pid: 412,  user: 'root', cpu: 0, mem: 1.8, command: 'dockerd',                       base: 2.5 },
  { pid: 590,  user: 'root', cpu: 0, mem: 0.9, command: 'containerd',                    base: 1.2 },
  { pid: 811,  user: 'enes', cpu: 0, mem: 9.6, command: 'ollama serve (qwen3:14b)',      base: 18 },
  { pid: 902,  user: 'enes', cpu: 0, mem: 2.1, command: 'node portfolio.service :3000', base: 3.5 },
  { pid: 1033, user: 'nobody', cpu: 0, mem: 1.4, command: 'prometheus',                  base: 2.2 },
  { pid: 1034, user: 'grafana', cpu: 0, mem: 1.9, command: 'grafana-server',             base: 1.6 },
  { pid: 1207, user: 'enes', cpu: 0, mem: 0.4, command: 'bash',                          base: 0.1 },
  { pid: 1338, user: 'enes', cpu: 0, mem: 0.3, command: 'n8n worker',                    base: 0.8 },
  { pid: 1402, user: 'root', cpu: 0, mem: 0.2, command: 'sshd',                          base: 0.1 },
  { pid: 1999, user: 'enes', cpu: 0, mem: 0.1, command: 'top',                           base: 0.6 },
];

const jitter = (base: number) => Math.max(0, base * (0.4 + Math.random() * 1.4) + (Math.random() < 0.08 ? Math.random() * 25 : 0));
const fmtTime = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}.${String(Math.floor((s * 100) % 100)).padStart(2, '0')}`;
const col = (v: string | number, w: number, right = true) => (right ? String(v).padStart(w) : String(v).padEnd(w));

/** A small, live `top`: values wander every second; q / Esc quits. */
const TopView: React.FC<{ onQuit: () => void }> = ({ onQuit }) => {
  const [tick, setTick] = useState(0);
  const [procs, setProcs] = useState(() => PROCS.map(p => ({ ...p, cpu: jitter(p.base), time: Math.random() * 600 })));

  useEffect(() => {
    const id = setInterval(() => {
      setTick(t => t + 1);
      setProcs(prev => prev.map(p => {
        const cpu = jitter(p.base);
        return { ...p, cpu, mem: Math.max(0.1, p.mem + (Math.random() - 0.5) * 0.1), time: p.time + cpu / 100 };
      }));
    }, 1000);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' || e.key.toLowerCase() === 'q') { e.preventDefault(); onQuit(); } };
    window.addEventListener('keydown', onKey);
    return () => { clearInterval(id); window.removeEventListener('keydown', onKey); };
  }, [onQuit]);

  const sorted = [...procs].sort((a, b) => b.cpu - a.cpu);
  const totalCpu = Math.min(99.9, sorted.reduce((s, p) => s + p.cpu, 0) / 8);
  const memUsed = 16384 + Math.round(Math.sin(tick / 3) * 220);
  const now = new Date();
  const p2 = (n: number) => String(n).padStart(2, '0');
  const load = [(0.4 + totalCpu / 40).toFixed(2), (0.35 + totalCpu / 60).toFixed(2), '0.31'];

  return (
    <div className="top">
      <div>top - {p2(now.getHours())}:{p2(now.getMinutes())}:{p2(now.getSeconds())} up 42 days,  1 user,  load average: {load.join(', ')}</div>
      <div>Tasks: <span className="c-bright">{procs.length + 136}</span> total,   <span className="c-bright">1</span> running, {procs.length + 135} sleeping,   0 stopped,   0 zombie</div>
      <div>%Cpu(s): <span className="c-bright">{totalCpu.toFixed(1)}</span> us,  {(totalCpu / 5).toFixed(1)} sy,  0.0 ni, <span className="c-bright">{(100 - totalCpu * 1.2).toFixed(1)}</span> id,  0.1 wa</div>
      <div>MiB Mem :  32768.0 total,  {(32768 - memUsed - 4096).toFixed(1)} free,  <span className="c-bright">{memUsed.toFixed(1)}</span> used,   4096.0 buff/cache</div>
      <div className="top-head">{col('PID', 6)} {col('USER', 8, false)} {col('%CPU', 6)} {col('%MEM', 5)} {col('TIME+', 9)}  COMMAND</div>
      {sorted.map(p => (
        <div key={p.pid} className={p.cpu > 15 ? 'c-bright' : undefined}>
          {col(p.pid, 6)} {col(p.user, 8, false)} {col(p.cpu.toFixed(1), 6)} {col(p.mem.toFixed(1), 5)} {col(fmtTime(p.time), 9)}  {p.command}
        </div>
      ))}
      <button type="button" className="program-exit" onClick={onQuit}>[ q: çık ]</button>
    </div>
  );
};

export default TopView;
