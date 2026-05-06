import React, { useState, useEffect, useRef } from 'react';
import './styles/App.css';

// Components
import BootScreen from './components/BootScreen';
import SnakeGame from './components/SnakeGame';
import AboutTab from './components/Tabs/AboutTab';
import WritingsTab from './components/Tabs/WritingsTab';
import ProjectsTab from './components/Tabs/ProjectsTab';
import ContactTab from './components/Tabs/ContactTab';

// Data
import { TABS, ALL_CMDS, NEOFETCH_OUT } from './data/constants';

const App: React.FC = () => {
  const [booted,    setBooted]    = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [cmdValue,  setCmdValue]  = useState('');
  const [cmdOutput, setCmdOutput] = useState('');
  const [clock,     setClock]     = useState('');
  const [historyIdx,setHistoryIdx]= useState(-1);
  const [draft,     setDraft]     = useState('');
  const [snakeOn,   setSnakeOn]   = useState(false);

  const histRef     = useRef<string[]>([]);
  const inputRef    = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString('tr-TR', { hour:'2-digit', minute:'2-digit', second:'2-digit' }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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

  return (
    <div className="crt-wrapper">
      {!booted ? (
        <BootScreen onBootComplete={() => setBooted(true)} />
      ) : (
        <>
          <div className="scanline" />

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
              <div style={{ color:'var(--green-dark)', fontSize:11 }}>{clock}</div>
            </div>

            {/* NAV */}
            <nav className="nav" style={{ opacity: snakeOn ? 0.3 : 1, pointerEvents: snakeOn ? 'none' : 'auto' }}>
              {TABS.map(tab => (
                <button key={tab} className={`nav-btn${activeTab===tab?' active':''}`} onClick={() => setActiveTab(tab)}>
                  ~/{tab}
                </button>
              ))}
            </nav>

            {/* CONTENT */}
            <div className="content">
              {snakeOn ? (
                <SnakeGame onQuit={() => {
                  setSnakeOn(false);
                  setCmdOutput('<span style="color:#007a1f">snake kapatıldı — hoş geldin geri</span>');
                  setTimeout(() => inputRef.current?.focus(), 50);
                }} />
              ) : (
                <>
                  {activeTab === 'about' && <AboutTab />}
                  {activeTab === 'writings' && <WritingsTab openLink={openLink} />}
                  {activeTab === 'projects' && <ProjectsTab />}
                  {activeTab === 'contact' && <ContactTab />}
                </>
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
      )}
    </div>
  );
};

export default App;
