import React, { useEffect, useState } from 'react';
import { EXPERIENCE, EDUCATION } from '../data/constants';
import { ACHIEVEMENTS, isUnlocked, unlockedCount } from './achievements';
import { Step } from './devops';
import { Project } from './remote';

/* ───────── git log: the career as a commit history ───────── */
const hash = (s: string) => {
  let h = 2166136261;
  for (const ch of s) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return (h >>> 0).toString(16).padStart(8, '0').slice(0, 7);
};
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const gitDate = (ym: string) => { const [y, m] = ym.split('-').map(Number); return `${MONTHS[m - 1]} 1 ${y}`; };

const COMMITS = [
  ...EXPERIENCE.flatMap(e => [
    ...(e.end ? [{ when: e.end, msg: `chore: ${e.company} dönemi tamamlandı`, body: [] as string[] }] : []),
    { when: e.start, msg: `feat: ${e.company} — ${e.role}`, body: e.details },
  ]),
  { when: EDUCATION.years.split('–')[1]?.trim() + '-06', msg: `release: ${EDUCATION.degree} mezuniyeti (GNO ${EDUCATION.gpa})`, body: [EDUCATION.school] },
  { when: EDUCATION.years.split('–')[0].trim() + '-09', msg: `init: ${EDUCATION.school}`, body: [] },
].sort((a, b) => (a.when < b.when ? 1 : -1));

export const GitLog: React.FC<{ oneline: boolean }> = ({ oneline }) => (
  <div>
    {COMMITS.map((c, i) => (
      oneline ? (
        <div key={i}><span className="c-amber">{hash(c.msg)}</span>{i === 0 ? <span className="c-cyan"> (HEAD -&gt; main)</span> : ''} {c.msg}</div>
      ) : (
        <div key={i} className={i ? 'gap-top' : undefined}>
          <div className="c-amber">commit {hash(c.msg)}{hash(c.when)}{hash(c.msg + c.when)}{i === 0 ? <span className="c-cyan"> (HEAD -&gt; main, origin/main)</span> : ''}</div>
          <div>Author: Enes Aksu &lt;enesaks.com&gt;</div>
          <div>Date:   {gitDate(c.when)}</div>
          <div className="indent c-bright">{c.msg}</div>
          {c.body.map((b, j) => <div key={j} className="indent prose">{b}</div>)}
        </div>
      )
    ))}
  </div>
);

/* ───────── achievements ───────── */
export const Achievements: React.FC = () => (
  <div>
    <div className="c-dim">{unlockedCount()} / {ACHIEVEMENTS.length} başarım açıldı</div>
    {ACHIEVEMENTS.map(a => isUnlocked(a.id) ? (
      <div key={a.id}><span className="c-amber">[★]</span> <span className="c-bright">{a.title}</span> <span className="c-dim">— {a.hint}</span></div>
    ) : (
      <div key={a.id} className="c-dim">[ ] ??? — {a.hint}</div>
    ))}
  </div>
);

export const AchievementToast: React.FC<{ title: string; hint: string }> = ({ title, hint }) => (
  <div className="toast"><span className="c-amber">[★] Başarım açıldı:</span> <span className="c-bright">{title}</span> <span className="c-dim">— {hint} · achievements</span></div>
);

/* ───────── man pages ───────── */
export const MAN: Record<string, [string, string, string]> = {
  ls:       ['ls [-la] [yol]', 'dizin içeriğini listeler', '-l uzun liste, -a gizli dosyaları da gösterir. Yeşil adlara tıklanabilir.'],
  cd:       ['cd [dizin]', 'çalışma dizinini değiştirir', 'Argümansız ya da ~ ile ev dizinine döner, .. bir üst dizine çıkar.'],
  cat:      ['cat <dosya>...', 'dosya içeriğini yazdırır', 'Yazılar ~/writings altında, proje README\'leri ~/projects/<depo>/README.md yolunda.'],
  grep:     ['<komut> | grep [-i] <kalıp>', 'çıktıdaki eşleşen satırları süzer', 'Herhangi bir komutun çıktısı boru ile grep\'e verilebilir. -i büyük/küçük harfi yok sayar.'],
  git:      ['git log [--oneline]', 'kariyer geçmişini commit olarak gösterir', 'Her iş ve eğitim adımı bir commit\'tir; en yenisi en üstte.'],
  open:     ['open <hedef>', 'bağlantıyı yeni sekmede açar', 'github, linkedin, medium, instagram, mail, bir dosya ya da tam URL alır.'],
  docker:   ['docker ps | images | run <imaj>', 'sahte Docker istemcisi', 'Konteynerler gerçek değildir ama portfolyonun neyle çalıştığını anlatır.'],
  kubectl:  ['kubectl get pods', 'sahte Kubernetes istemcisi', 'coffee-maker podunu düzeltmeye çalışma.'],
  ping:     ['ping <adres>', 'ağ erişimini sınar', 'Dört paket gönderir; Ctrl+C ile durdurulur.'],
  weather:  ['weather [şehir]', 'hava durumunu gösterir', 'Veriler open-meteo.com\'dan anlık çekilir. Varsayılan şehir İstanbul.'],
  theme:    ['theme green|amber|white|blue', 'fosfor rengini değiştirir', 'Seçim tarayıcıda saklanır. Gizli bir tuş dizisi de rengi değiştirir.'],
  top:      ['top', 'süreçleri canlı listeler', 'q ya da Esc ile çıkılır.'],
  vim:      ['vim [dosya]', 'metin düzenleyici', 'Çıkmak için :q yaz ve Enter\'a bas. Evet, herkes bunu arar.'],
  snake:    ['snake', 'yılan oyunu', 'WASD / ok tuşları, P duraklat, R yeniden başlat, Q çık.'],
  typer:    ['typer', 'yazma oyunu', 'Düşen komutları yere değmeden yaz.'],
  achievements: ['achievements', 'başarımları listeler', 'Gizli komutları buldukça yeni başarımlar açılır.'],
  exit:     ['exit', 'oturumu kapatır', 'Monitör kapanır; ekrana tıklayınca yeniden açılır.'],
};

export const Man: React.FC<{ cmd: string }> = ({ cmd }) => {
  const [synopsis, name, desc] = MAN[cmd];
  const head = `${cmd.toUpperCase()}(1)`;
  return (
    <div>
      <div className="c-dim">{head.padEnd(30)}enesaks.com kılavuzu{head.padStart(30)}</div>
      <div className="gap-top c-bright">NAME</div>
      <div className="indent">{cmd} — {name}</div>
      <div className="gap-top c-bright">SYNOPSIS</div>
      <div className="indent c-green">{synopsis}</div>
      <div className="gap-top c-bright">DESCRIPTION</div>
      <div className="indent prose">{desc}</div>
    </div>
  );
};

/* ───────── project README from GitHub ───────── */
export const Readme: React.FC<{ project: Project }> = ({ project }) => {
  const [text, setText] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let alive = true;
    fetch(`https://api.github.com/repos/enesaks/${encodeURIComponent(project.title)}/readme`, { headers: { Accept: 'application/vnd.github.raw' } })
      .then(r => (r.ok ? r.text() : Promise.reject(new Error(String(r.status)))))
      .then(t => { if (alive) setText(t); })
      .catch(() => { if (alive) setFailed(true); });
    return () => { alive = false; };
  }, [project.title]);

  if (failed) return <div>cat: README.md: bulunamadı — <a href={project.url} target="_blank" rel="noreferrer">{project.url.replace('https://', '')}</a></div>;
  if (text === null) return <div className="c-dim">github.com/enesaks/{project.title} okunuyor...</div>;

  // drop HTML and image-only lines, collapse runs of blank lines, trim the end
  const lines = text
    .replace(/<[^>]+>/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\n[ \t]*(\n[ \t]*)+/g, '\n\n')
    .trimEnd()
    .split('\n')
    .slice(0, 80);
  return (
    <div className="readme">
      {lines.map((l, i) => {
        const clean = l.replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/\*\*|__|`/g, '');
        if (/^#{1,6}\s/.test(clean)) return <div key={i} className="c-bright">{clean}</div>;
        if (/^\s*[-*]\s/.test(clean)) return <div key={i}>{clean.replace(/^(\s*)[-*]\s/, '$1• ')}</div>;
        return <div key={i}>{clean || ' '}</div>;
      })}
      {text.split('\n').length > 80 && <div className="c-dim">... devamı: {project.url.replace('https://', '')}</div>}
    </div>
  );
};

/* ───────── weather (open-meteo, no key needed) ───────── */
const WMO: [number[], string, string[]][] = [
  [[0], 'Açık', ['    \\   /    ', '     .-.     ', '  ― (   ) ―  ', '     `-´     ', '    /   \\    ']],
  [[1, 2], 'Parçalı bulutlu', ['   \\  /      ', ' _ /"".-.    ', '   \\_(   ).  ', '   /(___(__) ', '             ']],
  [[3, 45, 48], 'Bulutlu / sisli', ['             ', '     .--.    ', '  .-(    ).  ', ' (___.__)__) ', '             ']],
  [[51, 53, 55, 61, 63, 65, 80, 81, 82], 'Yağmurlu', ['     .-.     ', '    (   ).   ', '   (___(__)  ', '    ʻ ʻ ʻ ʻ  ', '   ʻ ʻ ʻ ʻ   ']],
  [[71, 73, 75, 77, 85, 86], 'Karlı', ['     .-.     ', '    (   ).   ', '   (___(__)  ', '    *  *  *  ', '   *  *  *   ']],
  [[95, 96, 99], 'Fırtınalı', ['     .-.     ', '    (   ).   ', '   (___(__)  ', '    ⚡ʻ ʻ⚡  ', '    ʻ ʻ ʻ    ']],
];

export const Weather: React.FC<{ city: string }> = ({ city }) => {
  const [state, setState] = useState<{ name: string; temp: number; wind: number; hum: number; code: number } | 'loading' | 'error' | 'notfound'>('loading');
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const geo = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=tr`).then(r => r.json());
        const place = geo?.results?.[0];
        if (!place) { if (alive) setState('notfound'); return; }
        const w = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`).then(r => r.json());
        const c = w.current;
        if (alive) setState({ name: `${place.name}${place.country ? ', ' + place.country : ''}`, temp: c.temperature_2m, wind: c.wind_speed_10m, hum: c.relative_humidity_2m, code: c.weather_code });
      } catch { if (alive) setState('error'); }
    })();
    return () => { alive = false; };
  }, [city]);

  if (state === 'loading') return <div className="c-dim">open-meteo.com sorgulanıyor...</div>;
  if (state === 'notfound') return <div>weather: '{city}' diye bir yer bulunamadı</div>;
  if (state === 'error') return <div>weather: hava durumu servisine ulaşılamadı</div>;
  const [, label, art] = WMO.find(([codes]) => codes.includes(state.code)) || WMO[2];
  return (
    <div>
      <div>Hava durumu: <span className="c-bright">{state.name}</span></div>
      <div className="weather">
        <pre className="c-amber">{art.join('\n')}</pre>
        <div>
          <div className="c-bright">{label}</div>
          <div><span className="c-cyan">sıcaklık</span> {Math.round(state.temp)} °C</div>
          <div><span className="c-cyan">rüzgâr</span>   {Math.round(state.wind)} km/s</div>
          <div><span className="c-cyan">nem</span>      %{state.hum}</div>
        </div>
      </div>
    </div>
  );
};

/* ───────── curl / traceroute / ssh ───────── */
export const curlHead = (url: string): React.ReactNode => {
  const host = url.replace(/^https?:\/\//, '').split('/')[0] || 'enesaks.com';
  return (
    <div className="pre">
      {[`HTTP/2 200`, `server: Vercel`, `content-type: text/html; charset=utf-8`, `x-powered-by: coffee, linux, and late nights`,
        `x-hire-me: true`, `strict-transport-security: max-age=63072000`, `date: ${new Date().toUTCString()}`, ``,
        `<!-- ${host}: tarayıcıda bakmak daha güzel ;) -->`].join('\n')}
    </div>
  );
};

export const traceroute = (host: string): Step[] => {
  const hops = [
    ['_gateway', '192.168.1.1'], ['isp-core-ist.net', '10.24.0.1'], ['ist-ix.peering', '185.1.48.12'],
    ['fra-edge.vercel-dns', '76.76.19.1'], [host, '76.76.21.21'],
  ];
  return [
    { delay: 0, node: <div>traceroute to {host} (76.76.21.21), 30 hops max, 60 byte packets</div> },
    ...hops.map(([name, ip], i) => {
      const ms = () => (2 + i * 6 + Math.random() * 3).toFixed(3);
      return { delay: 450, node: <div>{String(i + 1).padStart(2)}  {name} ({ip})  {ms()} ms  {ms()} ms  {ms()} ms</div> };
    }),
  ];
};

export const ssh = (target: string): Step[] => [
  { delay: 0, node: <div>ssh: connecting to {target || 'enesaks.com'} port 22...</div> },
  { delay: 700, node: <div>The authenticity of host 'enesaks.com (76.76.21.21)' can't be established.</div> },
  { delay: 300, node: <div>ED25519 key fingerprint is SHA256:3n3s4ksu/d3v0ps+cl0ud/h1r3m3.</div> },
  { delay: 600, node: <div className="c-red">enes@enesaks.com: Permission denied (publickey).</div> },
  { delay: 400, node: <div className="c-dim">Anahtarın yok ama kapım açık: <span className="c-cyan">contact</span></div> },
];
