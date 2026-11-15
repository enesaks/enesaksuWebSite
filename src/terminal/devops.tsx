import React from 'react';

/** One line of a streamed command: printed `delay` ms after the previous one. */
export interface Step { delay: number; node: React.ReactNode; effect?: 'glitch' }

const table = (rows: string[][]) => {
  const widths = rows[0].map((_, c) => Math.max(...rows.map(r => r[c].length)));
  return rows.map(r => r.map((cell, c) => (c === r.length - 1 ? cell : cell.padEnd(widths[c] + 3))).join(''));
};

const TableOut: React.FC<{ rows: string[][] }> = ({ rows }) => (
  <div className="pre wide">
    {table(rows).map((line, i) => <div key={i} className={i === 0 ? 'c-dim' : undefined}>{line}</div>)}
  </div>
);

/* ───────── docker ───────── */
export const DockerPs: React.FC = () => (
  <TableOut rows={[
    ['CONTAINER ID', 'IMAGE', 'STATUS', 'PORTS', 'NAMES'],
    ['3f9a2c1e7b04', 'enesaks/portfolio', 'Up 42 days', ':3000->3000', 'portfolio'],
    ['a71d0e5c9f22', 'ollama/ollama', 'Up 42 days', ':11434->11434', 'ollama'],
    ['c08b44de1a90', 'prom/prometheus', 'Up 42 days', ':9090->9090', 'prometheus'],
    ['5e2f9b7d3c11', 'grafana/grafana', 'Up 42 days', ':3001->3000', 'grafana'],
    ['9d6a1f0b2e48', 'n8nio/n8n', 'Up 3 days', ':5678->5678', 'n8n'],
  ]} />
);

export const DockerImages: React.FC = () => (
  <TableOut rows={[
    ['REPOSITORY', 'TAG', 'IMAGE ID', 'SIZE'],
    ['enesaks/portfolio', 'latest', '3f9a2c1e7b04', '48.2MB'],
    ['ollama/ollama', 'latest', 'b1e0c7a9d332', '3.41GB'],
    ['prom/prometheus', 'v2.53', 'c08b44de1a90', '271MB'],
    ['grafana/grafana', '11.1', '5e2f9b7d3c11', '458MB'],
    ['n8nio/n8n', '1.60', '9d6a1f0b2e48', '612MB'],
  ]} />
);

export const dockerRun = (image: string): Step[] => {
  const name = image.includes(':') ? image : `${image}:latest`;
  const layers = ['a3ed95caeb02', '7c1f4d2b9e10', 'e5b8a07f3c66'];
  return [
    { delay: 0, node: <div>Unable to find image '{name}' locally</div> },
    { delay: 450, node: <div>latest: Pulling from library/{name.split(':')[0]}</div> },
    ...layers.map((l, i) => ({ delay: 380 + i * 120, node: <div>{l}: Pull complete</div> })),
    { delay: 300, node: <div className="c-dim">Digest: sha256:4f53e0a1c9b7d2e8f6a3b5c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1</div> },
    { delay: 120, node: <div>Status: Downloaded newer image for {name}</div> },
    { delay: 500, node: (
      <div className="gap-top">
        <div className="c-bright">Merhaba, enesaks.com'dan!</div>
        <div>Bu konteyner tarayıcında, sahte bir Docker ile çalıştı.</div>
        <div>Gerçeğini birlikte kurmak istersen: <span className="c-cyan">contact</span></div>
      </div>
    ) },
  ];
};

/* ───────── kubernetes ───────── */
export const KubectlPods: React.FC = () => (
  <TableOut rows={[
    ['NAME', 'READY', 'STATUS', 'RESTARTS', 'AGE'],
    ['portfolio-7d9c6b8f5-x2lqp', '1/1', 'Running', '0', '42d'],
    ['portfolio-7d9c6b8f5-m8wzt', '1/1', 'Running', '0', '42d'],
    ['prometheus-0', '1/1', 'Running', '1', '42d'],
    ['grafana-5f7b9c4d8-qk3vn', '1/1', 'Running', '0', '42d'],
    ['coffee-maker-6c8d7f9b4-zz1rx', '0/1', 'CrashLoopBackOff', '1337', '3d'],
  ]} />
);

/* ───────── ping ───────── */
export const ping = (host: string): Step[] => {
  const ip = host === 'localhost' || host === '127.0.0.1' ? '127.0.0.1' : `76.76.21.${(host.length * 37) % 200 + 20}`;
  const times = [11.8, 12.4, 10.9, 13.1].map(t => (t + Math.random() * 2).toFixed(1));
  return [
    { delay: 0, node: <div>PING {host} ({ip}) 56(84) bytes of data.</div> },
    ...times.map((t, i) => ({ delay: i === 0 ? 300 : 1000, node: <div>64 bytes from {ip}: icmp_seq={i + 1} ttl=57 time={t} ms</div> })),
    { delay: 200, node: (
      <div>
        <div>{' '}</div>
        <div>--- {host} ping statistics ---</div>
        <div>4 packets transmitted, 4 received, 0% packet loss, time 3004ms</div>
      </div>
    ) },
  ];
};

/* ───────── rm -rf / ───────── */
export const rmRoot = (): Step[] => {
  const dirs = ['/bin', '/boot', '/etc', '/home/enes/projects', '/home/enes/writings', '/lib', '/opt', '/usr', '/var/log'];
  return [
    ...dirs.map((d, i) => ({ delay: i === 0 ? 150 : 110, node: <div className="c-red">removed directory '{d}'</div> })),
    { delay: 350, node: <div className="c-red">Kernel panic - not syncing: Attempted to kill init! exitcode=0x0000000b</div>, effect: 'glitch' as const },
    { delay: 1500, node: (
      <div className="gap-top">
        <div className="c-bright">...şaka şaka ;)</div>
        <div className="c-dim">rm: cannot remove '/': Read-only file system — her şey yerinde.</div>
      </div>
    ) },
  ];
};

/* ───────── themes ───────── */
export const THEMES: Record<string, string> = {
  green: 'P1 yeşil fosfor (varsayılan)',
  amber: 'P3 amber fosfor',
  white: 'P4 beyaz fosfor',
  blue: 'mavi fosfor',
};
