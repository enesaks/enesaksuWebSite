import React, { useState, useEffect, useRef } from 'react';

/* ─── Snake constants (module-level) ───────────────────────── */
const S_COLS = 30;
const S_ROWS = 20;
const S_CELL = 17;

type Vec = { x: number; y: number };
type GS  = { snake: Vec[]; dir: Vec; next: Vec; food: Vec; score: number; alive: boolean };

function mkGame(): GS {
  return {
    snake: [{ x: 15, y: 10 }, { x: 14, y: 10 }, { x: 13, y: 10 }],
    dir:  { x: 1, y: 0 },
    next: { x: 1, y: 0 },
    food: { x: 22, y: 6 },
    score: 0,
    alive: true,
  };
}

function rndFood(snake: Vec[]): Vec {
  let f: Vec;
  do { f = { x: Math.floor(Math.random() * S_COLS), y: Math.floor(Math.random() * S_ROWS) }; }
  while (snake.some(s => s.x === f.x && s.y === f.y));
  return f;
}

/* ─── SnakeGame component ───────────────────────────────────── */
const SnakeGame: React.FC<{ onQuit: () => void }> = ({ onQuit }) => {
  const cvs   = useRef<HTMLCanvasElement>(null);
  const gs    = useRef<GS>(mkGame());
  const [score, setScore] = useState(0);
  const [over,  setOver]  = useState(false);
  const [gkey,  setGkey]  = useState(0);

  const draw = () => {
    const c = cvs.current; if (!c) return;
    const ctx = c.getContext('2d'); if (!ctx) return;
    const g = gs.current;
    const W = S_COLS * S_CELL, H = S_ROWS * S_CELL;

    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = '#001a07';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= S_COLS; x++) { ctx.beginPath(); ctx.moveTo(x*S_CELL,0); ctx.lineTo(x*S_CELL,H); ctx.stroke(); }
    for (let y = 0; y <= S_ROWS; y++) { ctx.beginPath(); ctx.moveTo(0,y*S_CELL); ctx.lineTo(W,y*S_CELL); ctx.stroke(); }

    /* food */
    ctx.fillStyle = '#ffb000';
    ctx.beginPath();
    ctx.arc(g.food.x*S_CELL + S_CELL/2, g.food.y*S_CELL + S_CELL/2, S_CELL/2 - 2, 0, Math.PI*2);
    ctx.fill();

    /* snake */
    const len = g.snake.length;
    g.snake.forEach((seg, i) => {
      const t = i / Math.max(len - 1, 1);
      if (i === 0) ctx.fillStyle = '#00ff41';
      else if (t < 0.4) ctx.fillStyle = '#00cc33';
      else ctx.fillStyle = '#007a1f';
      const p = i === 0 ? 1 : 2;
      ctx.fillRect(seg.x*S_CELL+p, seg.y*S_CELL+p, S_CELL-p*2, S_CELL-p*2);
    });
  };

  /* game loop — re-runs on restart (gkey change) */
  useEffect(() => {
    gs.current = mkGame();
    gs.current.food = rndFood(gs.current.snake);
    setScore(0);
    setOver(false);

    let id: number, last = 0;
    const spd = () => Math.max(75, 160 - gs.current.score * 5);

    const loop = (t: number) => {
      id = requestAnimationFrame(loop);
      const g = gs.current;
      if (!g.alive || t - last < spd()) return;
      last = t;

      g.dir = g.next;
      const h: Vec = {
        x: (g.snake[0].x + g.dir.x + S_COLS) % S_COLS,
        y: (g.snake[0].y + g.dir.y + S_ROWS) % S_ROWS,
      };

      if (g.snake.some(s => s.x === h.x && s.y === h.y)) {
        g.alive = false;
        draw();
        setOver(true);
        return;
      }

      g.snake.unshift(h);
      if (h.x === g.food.x && h.y === g.food.y) {
        g.score++;
        setScore(g.score);
        g.food = rndFood(g.snake);
      } else {
        g.snake.pop();
      }
      draw();
    };

    draw();
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [gkey]);

  /* keyboard */
  useEffect(() => {
    const onK = (e: KeyboardEvent) => {
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) e.preventDefault();
      const g = gs.current, d = g.dir;
      switch (e.key) {
        case 'ArrowUp':    case 'w': case 'W': if (d.y !==  1) g.next = {x:0,y:-1};  break;
        case 'ArrowDown':  case 's': case 'S': if (d.y !== -1) g.next = {x:0,y:1};   break;
        case 'ArrowLeft':  case 'a': case 'A': if (d.x !==  1) g.next = {x:-1,y:0};  break;
        case 'ArrowRight': case 'd': case 'D': if (d.x !== -1) g.next = {x:1,y:0};   break;
        case 'r': case 'R': if (!g.alive) setGkey(k => k + 1); break;
        case 'Escape': case 'q': case 'Q': onQuit(); break;
      }
    };
    window.addEventListener('keydown', onK);
    return () => window.removeEventListener('keydown', onK);
  }, [onQuit]);

  return (
    <div style={{
      position:'fixed', inset:0, background:'rgba(0,0,0,0.94)',
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      zIndex:500, fontFamily:"'JetBrains Mono',monospace",
    }}>
      {/* header */}
      <div style={{ color:'#007a1f', fontSize:11, letterSpacing:2, marginBottom:10 }}>
        {'snake v1.0'}&nbsp;|&nbsp;
        {'score: '}<span style={{ color:'#00ff41' }}>{score}</span>
        &nbsp;|&nbsp;{'WASD / ↑↓←→'}&nbsp;|&nbsp;{'Q/ESC: çıkış'}
        {over && ' | R: tekrar'}
      </div>

      {/* canvas */}
      <div style={{ position:'relative', border:'1px solid #007a1f', boxShadow:'0 0 24px rgba(0,255,65,0.08)' }}>
        <canvas ref={cvs} width={S_COLS*S_CELL} height={S_ROWS*S_CELL} />
        {/* scanline overlay */}
        <div style={{
          position:'absolute', inset:0, pointerEvents:'none',
          background:'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.04) 2px,rgba(0,0,0,0.04) 4px)',
        }} />
        {/* game over */}
        {over && (
          <div style={{
            position:'absolute', inset:0,
            display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
            background:'rgba(0,0,0,0.78)',
          }}>
            <div style={{ color:'#ff4444', fontSize:22, fontWeight:700, letterSpacing:5 }}>GAME OVER</div>
            <div style={{ color:'#007a1f', fontSize:12, marginTop:10 }}>
              {'score: '}<span style={{ color:'#00ff41' }}>{score}</span>
            </div>
            <div style={{ marginTop:20, color:'#007a1f', fontSize:11 }}>R — tekrar oyna</div>
            <div style={{ marginTop:4,  color:'#007a1f', fontSize:11 }}>Q / ESC — çıkış</div>
          </div>
        )}
      </div>

      {/* legend */}
      <div style={{ color:'#002a0d', fontSize:10, letterSpacing:1, marginTop:10 }}>
        ● yem &nbsp;&nbsp;&nbsp; █ yılan &nbsp;&nbsp;&nbsp; hız her 5 puanda artar
      </div>
    </div>
  );
};

/* ─── App ───────────────────────────────────────────────────── */
const App: React.FC = () => {
  const [booted,    setBooted]    = useState(false);
  const [bootLines, setBootLines] = useState<{ text: string; cls: string }[]>([]);
  const [activeTab, setActiveTab] = useState('about');
  const [cmdValue,  setCmdValue]  = useState('');
  const [cmdOutput, setCmdOutput] = useState('');
  const [clock,     setClock]     = useState('');
  const [historyIdx,setHistoryIdx]= useState(-1);
  const [draft,     setDraft]     = useState('');
  const [muted,     setMuted]     = useState(false);
  const [snakeOn,   setSnakeOn]   = useState(false);

  const histRef     = useRef<string[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const inputRef    = useRef<HTMLInputElement>(null);

  const TABS     = ['about', 'writings', 'projects', 'contact'];
  const ALL_CMDS = ['help','about','writings','projects','contact','whoami','date','ls',
                    'pwd','uname','clear','history','neofetch','cd','open','snake','blog'];

  const BOOT = [
    { t: 0,    cls:'boot-title', text:'ENESAKSU OS v2.5.0 — Personal Terminal Portfolio' },
    { t: 180,  cls:'boot-info',  text:'Kernel 6.8.0-enesaksu #1 SMP x86_64 GNU/Linux' },
    { t: 320,  cls:'',           text:'' },
    { t: 420,  cls:'boot-ok',   text:'[  OK  ] Starting docker.service' },
    { t: 530,  cls:'boot-ok',   text:'[  OK  ] Starting ollama.service ... qwen3:14b loaded' },
    { t: 640,  cls:'boot-ok',   text:'[  OK  ] Starting aws.credentials' },
    { t: 750,  cls:'boot-warn', text:'[ WARN ] wsl2.memory: 16GB allocated (RTX 5060 Ti)' },
    { t: 860,  cls:'boot-ok',   text:'[  OK  ] Fetching medium.com/@enesaks ... 9 articles' },
    { t: 970,  cls:'boot-ok',   text:'[  OK  ] Fetching github.com/enesaks ... 34 repos' },
    { t: 1080, cls:'boot-ok',   text:'[  OK  ] Starting portfolio.service on :3000' },
    { t: 1180, cls:'',           text:'' },
    { t: 1260, cls:'boot-ok',   text:'System ready. Welcome, Enes.' },
  ];

  useEffect(() => {
    let maxT = 0;
    BOOT.forEach(line => {
      maxT = Math.max(maxT, line.t);
      setTimeout(() => {
        setBootLines(prev => [...prev, { text: line.text || ' ', cls: line.cls }]);
      }, line.t);
    });
    setTimeout(() => setBooted(true), maxT + 800);
  }, []);

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString('tr-TR', { hour:'2-digit', minute:'2-digit', second:'2-digit' }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const playClick = () => {
    if (muted) return;
    try {
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed')
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const len = Math.floor(ctx.sampleRate * 0.018);
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = (Math.random()*2-1) * Math.pow(1-i/len, 3);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const gain = ctx.createGain();
      gain.gain.value = 0.12;
      src.connect(gain);
      gain.connect(ctx.destination);
      src.start();
    } catch {}
  };

  const NEOFETCH_OUT = [
    `<div style="display:flex;gap:2.5rem;align-items:flex-start">`,
    `<pre style="color:#00ff41;font-size:10px;line-height:1.2;margin:0;font-family:'JetBrains Mono',monospace">`,
    `  ███████╗███╗   ██╗███████╗███████╗`,
    `  ██╔════╝████╗  ██║██╔════╝██╔════╝`,
    `  █████╗  ██╔██╗ ██║█████╗  ███████╗`,
    `  ██╔══╝  ██║╚██╗██║██╔══╝  ╚════██║`,
    `  ███████╗██║ ╚████║███████╗███████║`,
    `  ╚══════╝╚═╝  ╚═══╝╚══════╝╚══════╝`,
    `</pre><div style="line-height:1.8;font-size:12px">`,
    `<span style="color:#00d4ff">enes</span><span style="color:#007a1f">@</span><span style="color:#00d4ff">enesaks.com</span><br>`,
    `<span style="color:#007a1f">───────────────────────────</span><br>`,
    `<span style="color:#00d4ff">OS&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> ENESAKSU OS v2.5.0<br>`,
    `<span style="color:#00d4ff">Host&nbsp;&nbsp;&nbsp;</span> enesaks.com (Vercel)<br>`,
    `<span style="color:#00d4ff">Kernel&nbsp;</span> 6.8.0-enesaksu #1 SMP<br>`,
    `<span style="color:#00d4ff">Shell&nbsp;&nbsp;</span> bash 5.2.0<br>`,
    `<span style="color:#00d4ff">DE&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> terminal-portfolio<br>`,
    `<span style="color:#00d4ff">GPU&nbsp;&nbsp;&nbsp;&nbsp;</span> RTX 5060 Ti 16GB<br>`,
    `<span style="color:#00d4ff">Memory&nbsp;</span> 16GB / 32GB<br>`,
    `<span style="color:#00d4ff">Uptime&nbsp;</span> since boot`,
    `</div></div>`,
  ].join('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Enter') playClick();

    /* Tab autocomplete */
    if (e.key === 'Tab') {
      e.preventDefault();
      const val = cmdValue.toLowerCase().trimStart();
      if (val.startsWith('cd ')) {
        const match = TABS.find(t => t.startsWith(val.slice(3)) && t !== val.slice(3));
        if (match) setCmdValue(`cd ${match}`);
      } else if (val.length > 0) {
        const match = ALL_CMDS.find(c => c.startsWith(val) && c !== val);
        if (match) setCmdValue(match);
      }
      return;
    }

    /* History navigation */
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const hist = histRef.current;
      if (!hist.length) return;
      if (historyIdx === -1) { setDraft(cmdValue); setHistoryIdx(hist.length-1); setCmdValue(hist[hist.length-1]); }
      else if (historyIdx > 0) { setHistoryIdx(historyIdx-1); setCmdValue(hist[historyIdx-1]); }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx === -1) return;
      const hist = histRef.current;
      if (historyIdx >= hist.length-1) { setHistoryIdx(-1); setCmdValue(draft); }
      else { setHistoryIdx(historyIdx+1); setCmdValue(hist[historyIdx+1]); }
      return;
    }

    if (e.key !== 'Enter') return;

    const raw = cmdValue.trim();
    const cmd = raw.toLowerCase();
    setCmdValue('');
    setHistoryIdx(-1);
    setDraft('');
    if (!cmd) return;

    if (histRef.current[histRef.current.length-1] !== raw)
      histRef.current = [...histRef.current.slice(-49), raw];

    const TAB_CMDS: Record<string,string> = {
      about:'about', writings:'writings', blog:'writings', projects:'projects', contact:'contact',
    };
    const PWD: Record<string,string> = {
      about:'/home/enes/portfolio/about', writings:'/home/enes/portfolio/writings',
      projects:'/home/enes/portfolio/projects', contact:'/home/enes/portfolio/contact',
    };
    const LS: Record<string,string> = {
      about:   'about.txt&nbsp;&nbsp;experience.log',
      writings:'aws-notlarim.md&nbsp;&nbsp;git-notlarim.md&nbsp;&nbsp;linux-scripting.md&nbsp;&nbsp;docker-notlarim.md',
      projects:'AWS-IAM-S3-Ec2/&nbsp;&nbsp;Linux-Git-GitHub/&nbsp;&nbsp;dotNetFurniture/&nbsp;&nbsp;AuthorizationAPI/&nbsp;&nbsp;enesaksuWebSite/',
      contact: 'medium.lnk&nbsp;&nbsp;linkedin.lnk&nbsp;&nbsp;gmail.lnk&nbsp;&nbsp;instagram.lnk',
    };

    /* snake */
    if (cmd === 'snake') {
      setSnakeOn(true);
      inputRef.current?.blur();
      return;
    }

    /* cd */
    if (cmd.startsWith('cd')) {
      const arg = cmd.slice(2).trim();
      if (!arg || arg === '~' || arg === '..') { setActiveTab('about'); setCmdOutput('<span style="color:#00ff41">/home/enes/portfolio/about</span>'); }
      else if (TAB_CMDS[arg]) { setActiveTab(TAB_CMDS[arg]); setCmdOutput(`<span style="color:#00ff41">/home/enes/portfolio/${TAB_CMDS[arg]}</span>`); }
      else setCmdOutput(`<span style="color:#ff4444">cd: ${arg}: No such directory</span>`);
      return;
    }

    /* open */
    if (cmd.startsWith('open ')) {
      const arg = raw.slice(5).trim();
      const LINKS: Record<string,string> = {
        medium:'https://medium.com/@enesaks', github:'https://github.com/enesaks',
        linkedin:'https://www.linkedin.com/in/enesaks', instagram:'https://www.instagram.com/enes.aks29',
      };
      const url = LINKS[arg.toLowerCase()] || arg;
      if (url.startsWith('http://') || url.startsWith('https://')) {
        window.open(url, '_blank');
        setCmdOutput(`<span style="color:#00ff41">→ opening ${url}</span>`);
      } else {
        setCmdOutput(`<span style="color:#ff4444">open: bilinmeyen hedef. Kullanım: open medium|github|linkedin|instagram veya tam URL</span>`);
      }
      return;
    }

    /* history */
    if (cmd === 'history') {
      const hist = histRef.current;
      setCmdOutput(hist.length === 0
        ? '<span style="color:#007a1f">henüz komut girilmedi</span>'
        : hist.map((c: string, i: number) =>
            `<span style="color:#007a1f">${String(i+1).padStart(3)}</span>  <span style="color:#00ff41">${c}</span>`
          ).join('<br>')
      );
      return;
    }

    const OUTPUTS: Record<string,string> = {
      help:    `<span style="color:#00ff41">Komutlar: about | writings | projects | contact | cd &lt;tab&gt; | cd .. | open &lt;hedef&gt; | ls | pwd | whoami | date | uname | history | neofetch | snake | clear</span>`,
      whoami:  '<span style="color:#00ff41">enes aksu — junior devops engineer — istanbul, tr</span>',
      date:    `<span style="color:#00ff41">${new Date().toLocaleString('tr-TR')}</span>`,
      uname:   '<span style="color:#00ff41">Linux enesaks.com 6.8.0 #1 SMP x86_64 GNU/Linux</span>',
      pwd:     `<span style="color:#00ff41">${PWD[activeTab]}</span>`,
      ls:      `<span style="color:#00ff41">${LS[activeTab]}</span>`,
      neofetch: NEOFETCH_OUT,
    };

    if (TAB_CMDS[cmd]) { setActiveTab(TAB_CMDS[cmd]); setCmdOutput(`<span style="color:#00ff41">${TAB_CMDS[cmd]} açıldı</span>`); }
    else if (cmd === 'clear') setCmdOutput('');
    else if (OUTPUTS[cmd]) setCmdOutput(OUTPUTS[cmd]);
    else setCmdOutput(`<span style="color:#ff4444">bash: ${cmd}: command not found — 'help' yazın</span>`);
  };

  const openLink = (url: string) => window.open(url, '_blank');

  const ARTICLES = [
    { date:'AUG 18, 2025 · PINNED', title:'AWS ( Amazon Web Server ) Notlarım', desc:'AWS üzerinde çalışırken edindiğim bilgileri kısa ve öz şekilde topladığım notlardır.', tags:['AWS','CLOUD'], url:'https://medium.com/@enesaks/aws-amazon-web-server-notlar%C4%B1m-c92b29da0c6c' },
    { date:'AUG 11, 2025 · PINNED', title:'Git Notlarım', desc:'Git üzerinde çalışırken edindiğim bilgiler. Versiyon kontrolünün temelleri.', tags:['GIT','DEVOPS'], url:'https://medium.com/@enesaks/git-notlar%C4%B1m-b3ae2961ce0a' },
    { date:'JUL 5, 2025', title:'Linux Shell Scripting: Temeller ve Kod Örnekleri', desc:'Linux Shell Scripting üzerinde çalışırken edindiğim notlar ve pratik örnekler.', tags:['LINUX','BASH'], url:'https://medium.com/@enesaks/linux-shell-scripting-nedir-0bb9d584fb10' },
    { date:'DEC 13, 2024 · PINNED', title:'Linux Notlarım', desc:'Linux öğrenirken edindiğim bilgiler. Komutlar, dosya sistemi, kullanıcı yönetimi.', tags:['LINUX','SYSADMIN'], url:'https://medium.com/@enesaks/linux-notlar%C4%B1m-ea4c547535d1' },
    { date:'AUG 31, 2024 · PINNED', title:'Docker Notlarım', desc:'Docker üzerinde çalışırken edindiğim bilgileri kısa ve öz şekilde topladığım notlar.', tags:['DOCKER','CONTAINER'], url:'https://medium.com/@enesaks/docker-notlar%C4%B1m-b1011f78f813' },
    { date:'NOV 4, 2024', title:".NET Core API'de Identity Kullanarak Kullanıcı Kayıt ve Giriş İşlemleri", desc:'Basit bir .NET Core API projesinde Identity ile auth sistemi kurulumu.', tags:['.NET','C#','API'], url:'https://medium.com/@enesaks/net-core-apide-identity-kullanarak-kullan%C4%B1c%C4%B1-kay%C4%B1t-ve-giri%C5%9F-i%CC%87%C5%9Flemleri-a27a750e39b0' },
    { date:'SEP 22, 2024', title:'Dependency Injection Nedir? Transient, Scoped ve Singleton Farkları', desc:'DI kavramını ve .NET\'teki üç yaşam döngüsü farkını açıkladım.', tags:['.NET','DESIGN PATTERN'], url:'https://medium.com/@enesaks/dependency-injection-nedir-transient-scoped-ve-singleton-farklar%C4%B1-2c0d7d711965' },
    { date:'SEP 9, 2024', title:'.NET Core ile Basit Bir REST API Projesi Nasıl Yapılır?', desc:'Sıfırdan RESTful API geliştirme adımları, endpoint tasarımı ve best practice\'ler.', tags:['.NET','REST','API'], url:'https://medium.com/@enesaks/net-core-ile-basit-bir-restful-api-projesi-nas%C4%B1l-yap%C4%B1l%C4%B1r-ec8aa4694d45' },
    { date:'AUG 29, 2024', title:"Windows'ta C# ile Geliştirilen Projeyi Linux'a Nasıl Taşıyabiliriz?", desc:'.NET Core cross-platform özelliği ile Windows projelerini Linux ortamına taşıma rehberi.', tags:['LINUX','.NET','MIGRATION'], url:'https://medium.com/@enesaks/windows-%C3%BCzerinde-c-ile-geli%C5%9Ftirilen-bir-projeyi-linuxa-nas%C4%B1l-ta%C5%9F%C4%B1yabiliriz-b2d7f177e84e' },
  ];

  const PROJECTS = [
    { title:'AWS-IAM-S3-Ec2-Proje', desc:'AWS IAM, S3 bucket ve EC2 instance yönetimini kapsayan mini proje. IAM rolleri, politikalar ve servisler arası yetkilendirme.', tags:['AWS','IAM','S3','EC2','SHELL'], url:'https://github.com/enesaks/AWS-IAM-S3-Ec2-Proje', status:'live' },
    { title:'Linux-Git-GitHub-Mini-Proje', desc:'Linux ortamında Git ve GitHub workflow\'larını kapsayan mini proje. Branch yönetimi, merge stratejileri ve CI temelleri.', tags:['LINUX','GIT','GITHUB','DEVOPS'], url:'https://github.com/enesaks/Linux-Git-GitHub-Mini-Proje', status:'live' },
    { title:'dotNetFurnitureProject', desc:'.NET Core ile geliştirilen full-stack mobilya e-ticaret projesi. Katmanlı mimari, REST API ve frontend entegrasyonu.', tags:['.NET CORE','C#','SQL SERVER','HTML'], url:'https://github.com/enesaks/dotNetFurnitureProject', status:'live' },
    { title:'AuthorizationAPI', desc:'C# ile geliştirilmiş JWT tabanlı kimlik doğrulama ve yetkilendirme API\'si. Identity ile kullanıcı yönetimi.', tags:['C#','JWT','API','AUTH'], url:'https://github.com/enesaks/AuthorizationAPI', status:'live' },
    { title:'Arduino-Guvenlik-Sensor-Projesi', desc:'Arduino + ESP8266 WiFi modülü ile ultrasonik sensör kullanarak kişi algılama. IFTTT ile mobil bildirim sistemi.', tags:['ARDUINO','ESP8266','IOT','IFTTT'], url:'https://github.com/enesaks/Arduino-Guvenlik-Sensor-Projesi', status:'live' },
    { title:'enesaksuWebSite', desc:'Bu terminal portfolio sitesi. React + TypeScript + Vite ile geliştirildi. Vercel üzerinde deploy edildi.', tags:['REACT','TYPESCRIPT','VITE','VERCEL'], url:'https://github.com/enesaks/enesaksuWebSite', status:'wip' },
  ];

  const EXPERIENCE = [
    { period:'Ara 2025\nDevam ediyor · 5 ay', company:'Kartaca',          role:'System Monitoring',         badge:'CURRENT', badgeColor:'#00ff41' },
    { period:'Ağu 2025\nEyl 2025 · 2 ay',     company:'Halkbank',         role:'Stajyer',                    badge:'INTERN',  badgeColor:'#ffb000' },
    { period:'Eyl 2024\nEki 2024 · 2 ay',     company:'Bilsoft Yazılım',  role:'.NET Developer Intern',      badge:'INTERN',  badgeColor:'#ffb000' },
    { period:'Şub 2024\nAğu 2024 · 7 ay',     company:'Acunmedya Akademi',role:'Nish Trainings: C# & ASP.NET',badge:null,    badgeColor:'' },
  ];

  const css = `
    .scanline { position:fixed; inset:0; background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.025) 2px,rgba(0,0,0,0.025) 4px); pointer-events:none; z-index:9999; }
    .boot-screen { position:fixed; inset:0; background:var(--bg); z-index:1000; padding:2rem; overflow:hidden; }
    .boot-title { color:var(--green); font-weight:700; font-size:11px; }
    .boot-ok { color:var(--green); }
    .boot-warn { color:var(--amber); }
    .boot-info { color:var(--cyan); }
    .topbar { background:var(--bg2); border-bottom:1px solid var(--green-dark); padding:8px 16px; display:flex; align-items:center; gap:12px; position:sticky; top:0; z-index:100; }
    .dots { display:flex; gap:6px; }
    .dot { width:10px; height:10px; border-radius:50%; }
    .mute-btn { background:none; border:1px solid var(--green-dark); color:var(--green-dark); font-family:'JetBrains Mono',monospace; font-size:10px; padding:1px 6px; cursor:pointer; letter-spacing:1px; transition:color .15s,border-color .15s; }
    .mute-btn:hover,.mute-btn.on { color:var(--green); border-color:var(--green); }
    .nav { background:var(--bg2); border-bottom:1px solid var(--green-dark); padding:0 16px; display:flex; overflow-x:auto; }
    .nav-btn { background:none; border:none; color:var(--green-dark); font-family:'JetBrains Mono',monospace; font-size:12px; padding:8px 14px; cursor:pointer; border-bottom:2px solid transparent; letter-spacing:1px; white-space:nowrap; transition:color .15s; }
    .nav-btn:hover { color:var(--green); }
    .nav-btn.active { color:var(--green); border-bottom-color:var(--green); }
    .content { flex:1; padding:24px; max-width:900px; width:100%; margin:0; }
    .prompt-line { color:var(--green-dark); margin-bottom:16px; font-size:12px; }
    .prompt-cmd { color:var(--green); }
    .ascii-art { color:var(--green); font-size:10px; line-height:1.2; margin-bottom:20px; white-space:pre; }
    .info-row { display:flex; margin:6px 0; }
    .info-key { color:var(--cyan); min-width:160px; }
    .info-val { color:var(--green); }
    .exp-section-title { color:var(--amber); font-size:10px; letter-spacing:2px; margin:16px 0 10px; }
    .exp-item { display:flex; gap:12px; margin-bottom:12px; padding-bottom:12px; border-bottom:1px solid #001a07; }
    .exp-item:last-child { border-bottom:none; }
    .exp-left { min-width:110px; color:var(--green-dark); font-size:10px; text-align:right; white-space:pre-line; }
    .exp-company { color:var(--green); font-size:12px; font-weight:700; }
    .exp-role { color:var(--cyan); font-size:11px; }
    .exp-badge { display:inline-block; font-size:9px; padding:1px 5px; margin-left:6px; border:1px solid; vertical-align:middle; letter-spacing:1px; }
    .article-card { border:1px solid var(--green-dark); padding:14px 16px; margin-bottom:10px; cursor:pointer; transition:border-color .15s,background .15s; }
    .article-card:hover { border-color:var(--green); background:rgba(0,255,65,0.03); }
    .article-date { color:var(--green-dark); font-size:10px; letter-spacing:1px; margin-bottom:4px; }
    .article-title { color:var(--green); font-size:12px; font-weight:700; margin-bottom:4px; line-height:1.4; }
    .article-desc { color:var(--green-dim); font-size:11px; }
    .article-tag { display:inline-block; border:1px solid var(--green-dark); color:var(--cyan); font-size:10px; padding:1px 6px; margin-top:6px; margin-right:4px; letter-spacing:1px; }
    .medium-footer { margin-top:12px; font-size:11px; }
    .medium-footer a { color:var(--green-dim); text-decoration:none; }
    .medium-footer a:hover { color:var(--green); }
    .project-card { border:1px solid var(--green-dark); padding:16px; margin-bottom:12px; position:relative; transition:border-color .15s; }
    .project-card:hover { border-color:var(--green); }
    .proj-corner-l { position:absolute; top:-1px; left:8px; color:var(--green); background:var(--bg); padding:0 4px; font-size:11px; }
    .proj-corner-r { position:absolute; top:-1px; right:8px; color:var(--green); background:var(--bg); padding:0 4px; font-size:11px; }
    .proj-title a { color:var(--green); text-decoration:none; font-size:13px; font-weight:700; }
    .proj-title a:hover { text-decoration:underline; }
    .proj-desc { color:var(--green-dim); font-size:12px; margin:6px 0 8px; }
    .proj-tags { display:flex; gap:6px; flex-wrap:wrap; }
    .tag { background:var(--bg3); border:1px solid var(--green-dark); color:var(--cyan); font-size:10px; padding:2px 8px; letter-spacing:1px; }
    .proj-status { position:absolute; top:12px; right:16px; font-size:10px; }
    .contact-line { display:flex; align-items:center; gap:16px; padding:10px 0; border-bottom:1px solid var(--bg3); }
    .contact-line:last-child { border-bottom:none; }
    .contact-icon { min-width:90px; font-size:11px; letter-spacing:1px; }
    .contact-link { color:var(--green); text-decoration:none; font-size:12px; transition:color .15s; }
    .contact-link:hover { color:var(--cyan); }
    .cmd-output { padding:6px 16px; min-height:22px; font-size:12px; color:var(--green-dim); }
    .cmd-bar { border-top:1px solid var(--green-dark); background:var(--bg2); padding:10px 16px; display:flex; align-items:center; gap:8px; position:sticky; bottom:0; }
    .cmd-prompt-label { color:var(--green); white-space:nowrap; font-size:12px; }
    .cmd-input { background:none; border:none; color:var(--green); font-family:'JetBrains Mono',monospace; font-size:12px; flex:1; outline:none; caret-color:var(--green); }
    .cmd-input::placeholder { color:var(--green-dark); }
    .blink { animation:blink 1s step-end infinite; }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
  `;

  if (!booted) return (
    <>
      <style>{css}</style>
      <div className="scanline" />
      <div className="boot-screen">
        {bootLines.map((l, i) => <div key={i} className={l.cls}>{l.text}</div>)}
      </div>
    </>
  );

  return (
    <>
      <style>{css}</style>
      <div className="scanline" />

      {/* Snake overlay */}
      {snakeOn && (
        <SnakeGame onQuit={() => {
          setSnakeOn(false);
          setCmdOutput('<span style="color:#007a1f">snake kapatıldı — hoş geldin geri</span>');
          setTimeout(() => inputRef.current?.focus(), 50);
        }} />
      )}

      <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh' }}>

        {/* TOPBAR */}
        <div className="topbar">
          <div className="dots">
            <div className="dot" style={{ background:'#ff4444' }} />
            <div className="dot" style={{ background:'#ffb000' }} />
            <div className="dot" style={{ background:'#00ff41' }} />
          </div>
          <div style={{ flex:1, textAlign:'center', color:'var(--green-dim)', fontSize:11, letterSpacing:2 }}>
            enesaks.com — bash — 80x24
          </div>
          <button
            className={`mute-btn${muted ? '' : ' on'}`}
            onClick={() => setMuted((m: boolean) => !m)}
            title={muted ? 'sesi aç' : 'sesi kapat'}
          >
            {muted ? 'MUT' : 'SND'}
          </button>
          <div style={{ color:'var(--green-dark)', fontSize:11 }}>{clock}</div>
        </div>

        {/* NAV */}
        <nav className="nav">
          {TABS.map(tab => (
            <button key={tab} className={`nav-btn${activeTab===tab?' active':''}`} onClick={() => setActiveTab(tab)}>
              ~/{tab}
            </button>
          ))}
        </nav>

        {/* CONTENT */}
        <div className="content">

          {activeTab === 'about' && (
            <div>
              <div className="prompt-line">enes@portfolio:~$ <span className="prompt-cmd">cat about.txt</span></div>
              <pre className="ascii-art">{`  ███████╗███╗   ██╗███████╗███████╗
  ██╔════╝████╗  ██║██╔════╝██╔════╝
  █████╗  ██╔██╗ ██║█████╗  ███████╗
  ██╔══╝  ██║╚██╗██║██╔══╝  ╚════██║
  ███████╗██║ ╚████║███████╗███████║
  ╚══════╝╚═╝  ╚═══╝╚══════╝╚══════╝`}</pre>
              <div>
                {([['name','Enes Aksu'],['role',null],['education','Computer Engineer'],['location','Istanbul, TR'],['status','● available for opportunities'],['focus','Linux · Docker · CI/CD · AWS · Cloud']] as [string,string|null][]).map(([k,v]) => (
                  <div key={k} className="info-row">
                    <span className="info-key">{k}</span>
                    {k==='role'
                      ? <span className="info-val">Junior DevOps Engineer <span className="blink">█</span></span>
                      : <span className="info-val" style={k==='status'?{color:'var(--green)'}:{}}>{v}</span>
                    }
                  </div>
                ))}
              </div>
              <div className="exp-section-title">// EXPERIENCE</div>
              {EXPERIENCE.map((exp, i) => (
                <div key={i} className="exp-item">
                  <div className="exp-left">{exp.period}</div>
                  <div>
                    <div className="exp-company">
                      {exp.company}
                      {exp.badge && <span className="exp-badge" style={{ color:exp.badgeColor, borderColor:exp.badgeColor }}>{exp.badge}</span>}
                    </div>
                    <div className="exp-role">{exp.role}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'writings' && (
            <div>
              <div className="prompt-line">enes@portfolio:~$ <span className="prompt-cmd">curl -s https://medium.com/@enesaks | grep articles</span></div>
              {ARTICLES.map((a, i) => (
                <div key={i} className="article-card" onClick={() => openLink(a.url)}>
                  <div className="article-date">{a.date}</div>
                  <div className="article-title">{a.title}</div>
                  <div className="article-desc">{a.desc}</div>
                  <div>{a.tags.map(t => <span key={t} className="article-tag">{t}</span>)}</div>
                </div>
              ))}
              <div className="medium-footer">
                <span style={{ color:'var(--green-dark)' }}>$ </span>
                <a href="https://medium.com/@enesaks" target="_blank" rel="noreferrer">→ tüm yazılar için medium.com/@enesaks</a>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div>
              <div className="prompt-line">enes@portfolio:~$ <span className="prompt-cmd">gh repo list enesaks --limit 6 --sort updated</span></div>
              {PROJECTS.map((p, i) => (
                <div key={i} className="project-card">
                  <span className="proj-corner-l">[</span>
                  <span className="proj-corner-r">]</span>
                  <span className="proj-status" style={{ color:p.status==='live'?'var(--green)':'var(--amber)' }}>
                    {p.status==='live'?'● PUBLIC':'◉ WIP'}
                  </span>
                  <div className="proj-title"><a href={p.url} target="_blank" rel="noreferrer">{p.title}</a></div>
                  <div className="proj-desc">{p.desc}</div>
                  <div className="proj-tags">{p.tags.map(t => <span key={t} className="tag">{t}</span>)}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'contact' && (
            <div>
              <div className="prompt-line">enes@portfolio:~$ <span className="prompt-cmd">cat contact.json | jq .</span></div>
              {[
                { icon:'[medium]',    color:'#e8e8e8', href:'https://medium.com/@enesaks',           label:'medium.com/@enesaks' },
                { icon:'[linkedin]',  color:'#0077b5', href:'https://www.linkedin.com/in/enesaks',   label:'linkedin.com/in/enesaks' },
                { icon:'[gmail]',     color:'#d14836', href:'mailto:enesaksu3429@gmail.com',         label:'enesaksu3429@gmail.com' },
                { icon:'[instagram]', color:'#e4405f', href:'https://www.instagram.com/enes.aks29',  label:'@enes.aks29' },
              ].map((c, i) => (
                <div key={i} className="contact-line">
                  <span className="contact-icon" style={{ color:c.color }}>{c.icon}</span>
                  <a className="contact-link" href={c.href} target={c.href.startsWith('mailto')?undefined:'_blank'} rel="noreferrer">{c.label}</a>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* CMD */}
        <div className="cmd-output" dangerouslySetInnerHTML={{ __html: cmdOutput }} />
        <div className="cmd-bar">
          <span className="cmd-prompt-label">enes@portfolio:~$</span>
          <input
            ref={inputRef}
            className="cmd-input"
            placeholder="komut girin... (help | Tab: tamamla | ↑↓: geçmiş)"
            value={cmdValue}
            onChange={e => { setCmdValue(e.target.value); if (historyIdx !== -1) setHistoryIdx(-1); }}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

      </div>
    </>
  );
};

export default App;
