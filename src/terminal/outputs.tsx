import React, { createContext, useContext } from 'react';
import { EXPERIENCE, FOCUS, EDUCATION, LANGUAGES, SKILLS, CERTIFICATES, formatPeriod } from '../data/constants';
import { useRemote, Article } from './remote';
import { Entry, entries } from './fs';

/** Lets output lines run a command when clicked, as if the visitor had typed it. */
export const RunContext = createContext<(cmd: string) => void>(() => {});

export const Cmd: React.FC<{ run: string; children: React.ReactNode; className?: string }> = ({ run, children, className }) => {
  const exec = useContext(RunContext);
  return (
    <button type="button" className={`cmd-link ${className || ''}`} title={`$ ${run}`} onClick={e => { e.stopPropagation(); exec(run); }}>
      {children}
    </button>
  );
};

const Ext: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <a href={href} target={href.startsWith('mailto') ? undefined : '_blank'} rel="noreferrer" onClick={e => e.stopPropagation()}>{children}</a>
);

export const BANNER = [
  '███████╗███╗   ██╗███████╗███████╗',
  '██╔════╝████╗  ██║██╔════╝██╔════╝',
  '█████╗  ██╔██╗ ██║█████╗  ███████╗',
  '██╔══╝  ██║╚██╗██║██╔══╝  ╚════██║',
  '███████╗██║ ╚████║███████╗███████║',
  '╚══════╝╚═╝  ╚═══╝╚══════╝╚══════╝',
].join('\n');

/* ───────── about.txt / experience.log ───────── */
export const Experience: React.FC<{ detailed?: boolean }> = ({ detailed }) => (
  <div className="rows">
    {EXPERIENCE.map((exp, i) => (
      <div key={i} className={detailed ? 'item' : undefined}>
        <div className="exp-row">
          <span className="c-dim">[{formatPeriod(exp.start, exp.end)}]</span>{' '}
          <span className="c-bright">{exp.company}</span>
          <span className="c-dim"> :: </span>
          <span className="c-cyan">{exp.role}</span>
          {exp.badge && <span className={exp.end ? 'c-amber' : 'c-green'}> ({exp.badge})</span>}
        </div>
        {detailed && exp.details.map((d, j) => <div key={j} className="bullet prose">- {d}</div>)}
      </div>
    ))}
  </div>
);

export const Skills: React.FC = () => (
  <div className="kv">
    {SKILLS.map(([group, items]) => (
      <React.Fragment key={group}>
        <span className="c-cyan">{group}</span><span>{items.join(' · ')}</span>
      </React.Fragment>
    ))}
  </div>
);

export const Certificates: React.FC = () => (
  <div>
    {CERTIFICATES.map((name, i) => (
      <div key={name}><span className="c-dim">[{String(i + 1).padStart(2, '0')}]</span> {name}</div>
    ))}
  </div>
);

export const About: React.FC = () => (
  <div>
    <pre className="banner" aria-hidden="true">{BANNER}</pre>
    <div className="kv">
      <span className="c-cyan">name</span><span className="c-bright">Enes Aksu</span>
      <span className="c-cyan">role</span><span>Junior DevOps Engineer</span>
      <span className="c-cyan">education</span><span>{EDUCATION.school} — {EDUCATION.degree} <span className="c-dim">({EDUCATION.years} · GNO {EDUCATION.gpa})</span></span>
      <span className="c-cyan">location</span><span>Istanbul, TR</span>
      <span className="c-cyan">status</span><span className="c-green">● available for opportunities</span>
      <span className="c-cyan">focus</span><span>{FOCUS.join(' · ')}</span>
      <span className="c-cyan">languages</span><span>{LANGUAGES}</span>
    </div>
    <div className="c-amber gap-top"># skills</div>
    <Skills />
    <div className="c-amber gap-top"># experience</div>
    <Experience />
    <div className="c-dim gap-top">
      devamı: <Cmd run="experience">experience</Cmd> · <Cmd run="certs">certs</Cmd> · <Cmd run="writings">writings</Cmd> · <Cmd run="projects">projects</Cmd> · <Cmd run="contact">contact</Cmd> · <Cmd run="help">help</Cmd>
    </div>
  </div>
);

/* ───────── contact.json ───────── */
const CONTACTS: [string, string, string][] = [
  ['github',    'github.com/enesaks',        'https://github.com/enesaks'],
  ['linkedin',  'linkedin.com/in/enesaks',   'https://www.linkedin.com/in/enesaks'],
  ['medium',    'medium.com/@enesaks',       'https://medium.com/@enesaks'],
  ['mail',      'enesaksu3429@gmail.com',    'mailto:enesaksu3429@gmail.com'],
  ['instagram', '@enes.aks29',               'https://www.instagram.com/enes.aks29'],
];
export const LINKS: Record<string, string> = Object.fromEntries(CONTACTS.map(([k, , href]) => [k, href]));

export const Contact: React.FC = () => (
  <div>
    <div>{'{'}</div>
    {CONTACTS.map(([key, label, href], i) => (
      <div key={key} className="indent">
        <span className="c-cyan">"{key}"</span>: <span className="c-amber">"<Ext href={href}>{label}</Ext>"</span>{i < CONTACTS.length - 1 ? ',' : ''}
      </div>
    ))}
    <div>{'}'}</div>
  </div>
);

/* ───────── writings ───────── */
export const Writings: React.FC = () => {
  const { articles, loading } = useRemote();
  return (
    <div>
      <div className="c-dim">total {articles.length}{loading ? '  (medium.com senkronize ediliyor...)' : ''}</div>
      {articles.map((a, i) => (
        <div key={a.slug} className="item">
          <div>
            <span className="c-dim">[{String(i + 1).padStart(2, '0')}] {a.date}</span>{'  '}
            <Ext href={a.url}><span className="c-bright">{a.title}</span></Ext>
          </div>
          <div className="indent c-dim">
            <Cmd run={`cat ~/writings/${a.slug}`}>{a.slug}</Cmd>
            {a.tags.length > 0 && <span>{'  '}{a.tags.map(t => `#${t}`).join(' ')}</span>}
          </div>
        </div>
      ))}
      <div className="c-dim gap-top">okumak için başlığa tıkla ya da: cat ~/writings/&lt;dosya&gt; · tümü: <Ext href="https://medium.com/@enesaks">medium.com/@enesaks</Ext></div>
    </div>
  );
};

export const ArticleFile: React.FC<{ article: Article }> = ({ article }) => (
  <div>
    <div className="c-bright"># {article.title}</div>
    <div className="c-dim">{article.date}{article.tags.length ? ` · ${article.tags.map(t => `#${t}`).join(' ')}` : ''}</div>
    <div className="gap-top prose">{article.desc}</div>
    <div className="gap-top">→ devamını oku: <Ext href={article.url}>{article.url.replace(/^https?:\/\//, '').split('?')[0]}</Ext></div>
  </div>
);

/* ───────── projects ───────── */
export const Projects: React.FC = () => {
  const { projects, loading } = useRemote();
  return (
    <div>
      <div className="c-dim">Showing {projects.length} repositories in @enesaks{loading ? '  (github.com senkronize ediliyor...)' : ''}</div>
      {projects.map(p => (
        <div key={p.title} className="item">
          <div>
            <Ext href={p.url}><span className="c-bright">enesaks/{p.title}</span></Ext>{'  '}
            <span className={p.status === 'live' ? 'c-green' : 'c-amber'}>{p.status === 'live' ? 'public' : p.status}</span>
            {!!p.stars && <span className="c-amber">  ★{p.stars}</span>}
            {p.updated && <span className="c-dim">  {p.updated}</span>}
          </div>
          <div className="indent prose">{p.desc}</div>
          <div className="indent c-cyan">{p.tags.map(t => `[${t}]`).join(' ')}</div>
          <div className="indent c-dim"><Cmd run={`cat ~/projects/${p.title}/README.md`}>README.md</Cmd></div>
        </div>
      ))}
    </div>
  );
};

/* ───────── ls ───────── */
const MONTHS = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
const kindClass = (k: Entry['kind']) => (k === 'dir' || k === 'repo' ? 'c-blue' : k === 'exec' ? 'c-green' : '');
const suffix = (k: Entry['kind']) => (k === 'dir' || k === 'repo' ? '/' : k === 'exec' ? '*' : '');

const entryCommand = (dir: string, e: Entry) => {
  const path = dir ? `~/${dir}/${e.name}` : `~/${e.name}`;
  if (e.kind === 'dir') return `cd ${path}`;
  if (e.kind === 'repo') return `open ${path}`;
  if (e.kind === 'exec') return `./${e.name}`;
  return `cat ${path}`;
};

export const Ls: React.FC<{ dir: string; long: boolean; all: boolean; only?: Entry }> = ({ dir, long, all, only }) => {
  useRemote(); // re-render when live data arrives
  const list = only ? [only] : entries(dir, all) || [];
  const now = new Date();
  const stamp = `${MONTHS[now.getMonth()]} ${String(now.getDate()).padStart(2, ' ')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const dots: Entry[] = all && !only ? [{ name: '.', kind: 'dir', size: 4096 }, { name: '..', kind: 'dir', size: 4096 }] : [];

  const name = (e: Entry) =>
    e.name === '.' || e.name === '..'
      ? <span className="c-blue">{e.name}</span>
      : <Cmd run={entryCommand(dir, e)} className={kindClass(e.kind)}>{e.name}{suffix(e.kind)}</Cmd>;

  if (!long) {
    return <div className="ls-grid">{[...dots, ...list].map(e => <span key={e.name}>{name(e)}</span>)}</div>;
  }
  return (
    <div>
      {!only && <div>total {list.length * 4}</div>}
      {[...dots, ...list].map(e => (
        <div key={e.name} className="ls-row">
          <span className="ls-meta">
            {e.mode || (e.kind === 'dir' || e.kind === 'repo' ? 'drwxr-xr-x' : e.kind === 'exec' ? '-rwxr-xr-x' : '-rw-r--r--')}
            {` ${(e.owner || 'enes').padEnd(4)} ${(e.owner || 'enes').padEnd(4)} `}{String(e.size).padStart(5, ' ')} {stamp}{' '}
          </span>
          {name(e)}
        </div>
      ))}
    </div>
  );
};

export const Tree: React.FC = () => {
  useRemote();
  const root = entries('')!;
  return (
    <div className="pre">
      <div className="c-blue">.</div>
      {root.map((e, i) => {
        const last = i === root.length - 1;
        const kids = e.kind === 'dir' ? entries(e.name) || [] : [];
        return (
          <React.Fragment key={e.name}>
            <div>{last ? '└── ' : '├── '}<Cmd run={entryCommand('', e)} className={kindClass(e.kind)}>{e.name}{suffix(e.kind)}</Cmd></div>
            {kids.map((k, j) => (
              <div key={k.name}>{last ? '    ' : '│   '}{j === kids.length - 1 ? '└── ' : '├── '}
                <Cmd run={entryCommand(e.name, k)} className={kindClass(k.kind)}>{k.name}{suffix(k.kind)}</Cmd>
              </div>
            ))}
          </React.Fragment>
        );
      })}
    </div>
  );
};

/* ───────── neofetch / help ───────── */
export const Neofetch: React.FC<{ uptime: string }> = ({ uptime }) => (
  <div className="neofetch">
    <pre className="banner" aria-hidden="true">{BANNER}</pre>
    <div className="kv tight">
      <span className="c-cyan">enes<span className="c-dim">@</span>enesaks.com</span><span />
      <span className="c-cyan">OS</span><span>ENESAKSU OS v2.5.0 x86_64</span>
      <span className="c-cyan">Host</span><span>enesaks.com (Vercel)</span>
      <span className="c-cyan">Kernel</span><span>6.8.0-enesaksu</span>
      <span className="c-cyan">Uptime</span><span>{uptime}</span>
      <span className="c-cyan">Shell</span><span>bash 5.2.21</span>
      <span className="c-cyan">Terminal</span><span>/dev/tty1 (CRT, P1 phosphor)</span>
      <span className="c-cyan">GPU</span><span>RTX 5060 Ti 16GB</span>
      <span className="c-cyan">Memory</span><span>16GB / 32GB</span>
    </div>
  </div>
);

/** [label shown, command run on click]. Placeholders get a sensible example when clicked. */
type HelpItem = [string, string];
const HELP: [HelpItem[], string, string?][] = [
  [[['about', 'about']], 'hakkımda (cat ~/about.txt)'],
  [[['writings', 'writings']], 'Medium yazılarım'],
  [[['projects', 'projects']], 'GitHub projelerim'],
  [[['experience', 'experience'], ['skills', 'skills'], ['certs', 'certs']], 'deneyim detayları, beceriler, sertifikalar'],
  [[['contact', 'contact']], 'iletişim (cat ~/contact.json)'],
  [[['ls [-la] [yol]', 'ls -la']], 'dizini listele'],
  [[['cd <dizin>', 'cd writings']], 'dizin değiştir (cd .. / cd ~)'],
  [[['cat <dosya>', 'cat about.txt']], 'dosyayı yazdır'],
  [[['open <hedef>', 'open github']], 'github | linkedin | medium | instagram | mail | dosya | URL'],
  [[['git log [--oneline]', 'git log --oneline']], 'kariyer geçmişi, commit olarak'],
  [[['man <komut>', 'man ls']], 'komutun kılavuz sayfası'],
  [[['<komut> | grep <kalıp>', 'experience | grep -i aws']], 'çıktıyı süz'],
  [[['tree', 'tree'], ['pwd', 'pwd'], ['whoami', 'whoami'], ['date', 'date']], 'klasik araçlar'],
  [[['uname', 'uname -a'], ['uptime', 'uptime'], ['echo', 'echo merhaba'], ['history', 'history']], 'klasik araçlar'],
  [[['neofetch', 'neofetch']], 'sistem özeti'],
  [[['snake', 'snake'], ['typer', 'typer']], 'oyunlar'],
  [[['matrix', 'matrix'], ['hack', 'hack'], ['screensaver', 'screensaver']], 'eğlence'],
  [[['fortune', 'fortune'], ['cowsay <söz>', 'cowsay merhaba']], 'günün sözü'],
  [[['top', 'top'], ['ping <adres>', 'ping enesaks.com']], 'canlı süreç listesi, ağ testi'],
  [[['curl', 'curl enesaks.com'], ['traceroute', 'traceroute enesaks.com'], ['ssh', 'ssh enes@enesaks.com']], 'ağ araçları'],
  [[['weather [şehir]', 'weather']], 'hava durumu'],
  [[['vim', 'vim']], 'çıkabilirsen'],
  [[['achievements', 'achievements']], 'açtığın başarımlar'],
  [[['docker ps', 'docker ps'], ['docker images', 'docker images'], ['docker run', 'docker run hello-world'], ['kubectl get pods', 'kubectl get pods']], 'sahte konteynerler ve podlar'],
  [[['theme green', 'theme green'], ['amber', 'theme amber'], ['white', 'theme white'], ['blue', 'theme blue']], 'fosfor rengini değiştir', '|'],
  [[['degauss', 'degauss']], 'tüpü manyetik olarak sıfırla'],
  [[['sound on', 'sound on'], ['off', 'sound off']], 'tüp ve klavye sesleri', '|'],
  [[['crt on', 'crt on'], ['off', 'crt off']], 'tüp monitör efektlerini aç / kapat', '|'],
  [[['clear', 'clear']], 'ekranı temizle (Ctrl+L)'],
  [[['exit', 'exit']], 'monitörü kapat'],
];

export const BASHRC = `# ~/.bashrc
export PS1='\\u@enesaks:\\w\\$ '
export EDITOR=vim

alias ll='ls -la'
alias blog='writings'
alias k='kubectl'
alias tf='terraform'
alias please='sudo'

# fortune | cowsay`;

export const Secrets: React.FC = () => (
  <div>
    <div>[sudo] password for enes: ********</div>
    <div className="c-amber gap-top"># tebrikler, gizli dosyayı buldun.</div>
    <div className="kv help">
      <span className="c-green"><Cmd run="typer">typer</Cmd></span><span>düşen komutları yazarak vur</span>
      <span className="c-green"><Cmd run="snake">snake</Cmd></span><span>klasik yılan</span>
      <span className="c-green"><Cmd run="matrix">matrix</Cmd> · <Cmd run="hack">hack</Cmd></span><span>ekranı ele geçir</span>
      <span className="c-green"><Cmd run="fortune">fortune</Cmd> · <Cmd run="cowsay moo">cowsay</Cmd></span><span>günün sözü, inekli</span>
      <span className="c-green"><Cmd run="screensaver">screensaver</Cmd></span><span>ekran koruyucu (2 dk boşta kalınca kendiliğinden)</span>
      <span className="c-green"><Cmd run="sound on">sound on</Cmd></span><span>tüp vınlaması ve tuş sesleri</span>
      <span className="c-green"><Cmd run="theme amber">theme amber</Cmd></span><span>amber, beyaz ya da mavi fosfor</span>
      <span className="c-green">↑↑↓↓←→←→BA</span><span>bilenler bilir</span>
      <span className="c-green">rm -rf /</span><span>cesaretin varsa</span>
    </div>
    <div className="c-dim">ipucu: kasadaki iki düğme parlaklık ve kontrastı ayarlar, güç düğmesi de çalışır.</div>
    <div className="gap-top">API_KEY=<span className="c-red">nice-try-;)</span></div>
  </div>
);

export const Help: React.FC = () => (
  <div>
    <div className="c-dim">GNU bash, version 5.2.21 — enesaks.com sürümü. Bir komutu çalıştırmak için üstüne tıkla:</div>
    <div className="kv help">
      {HELP.map(([items, desc, sep = ', ']) => (
        <React.Fragment key={items[0][1]}>
          <span>
            {items.map(([label, run], i) => (
              <React.Fragment key={run}>
                {i > 0 && <span className="c-dim">{sep === '|' ? '|' : sep}</span>}
                <Cmd run={run}>{label}</Cmd>
              </React.Fragment>
            ))}
          </span>
          <span>{desc}</span>
        </React.Fragment>
      ))}
    </div>
    <div className="c-dim">Tab: tamamla · ↑↓: geçmiş · Ctrl+C: iptal · Ctrl+L: temizle · yeşil adlara tıklanabilir</div>
  </div>
);
