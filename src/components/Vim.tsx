import React, { useEffect, useRef, useState } from 'react';
import { beep } from '../terminal/sound';

const HELP_MSGS = [
  'Type  :qa!  and press <Enter> to abandon all changes and exit Vim',
  'İpucu: önce Esc, sonra :q yaz ve Enter\'a bas',
  'Panik yapma. :q',
];

/** A tiny vim: you can't edit anything, the challenge is getting out. */
const Vim: React.FC<{ file: string; onQuit: (escaped: boolean) => void }> = ({ file, onQuit }) => {
  const [mode, setMode] = useState<'normal' | 'insert' | 'command'>('normal');
  const [cmd, setCmd] = useState('');
  const [msg, setMsg] = useState('');
  const tries = useRef(0);
  const box = useRef<HTMLDivElement>(null);
  const rows = 22;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) {
        if (e.ctrlKey && e.key.toLowerCase() === 'c') { e.preventDefault(); setMsg('Type  :qa!  and press <Enter> to abandon all changes and exit Vim'); }
        return;
      }
      e.preventDefault();
      if (mode === 'command') {
        if (e.key === 'Escape') { setMode('normal'); setCmd(''); return; }
        if (e.key === 'Backspace') { if (!cmd) setMode('normal'); setCmd(c => c.slice(0, -1)); return; }
        if (e.key === 'Enter') {
          const c = cmd.trim();
          setMode('normal');
          setCmd('');
          if (/^(q|q!|qa|qa!|wq|wq!|x|x!|wqa)$/.test(c)) { onQuit(true); return; }
          if (c === 'w') { setMsg(`"${file}" E45: 'readonly' option is set (add ! to override)`); return; }
          beep(200);
          setMsg(`E492: Not an editor command: ${c}`);
          return;
        }
        if (e.key.length === 1) setCmd(c => c + e.key);
        return;
      }
      if (e.key === ':') { setMode('command'); setCmd(''); setMsg(''); return; }
      if (e.key === 'Escape') {
        if (mode === 'insert') { setMode('normal'); return; }
        tries.current++;
        setMsg(HELP_MSGS[Math.min(tries.current - 1, HELP_MSGS.length - 1)]);
        beep(200);
        return;
      }
      if (mode === 'normal' && (e.key === 'i' || e.key === 'a' || e.key === 'o')) { setMode('insert'); setMsg(''); return; }
      if (mode === 'insert') { setMsg('W10: Warning: Changing a readonly file'); return; }
      tries.current++;
      if (tries.current % 6 === 0) setMsg(HELP_MSGS[(tries.current / 6) % HELP_MSGS.length]);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mode, cmd, file, onQuit]);

  const content = [
    `# ${file}`,
    '',
    'Bu dosya salt okunur. Burada bir şey değiştiremezsin.',
    'Asıl soru: buradan nasıl çıkacaksın?',
  ];

  return (
    <div ref={box} className="vim">
      <div className="vim-body">
        {content.map((l, i) => <div key={i}>{l || ' '}</div>)}
        {Array.from({ length: rows }, (_, i) => <div key={`t${i}`} className="c-blue">~</div>)}
      </div>
      <div className="vim-status">
        {mode === 'command'
          ? <span>:{cmd}<span className="cursor">{' '}</span></span>
          : msg
            ? <span className={msg.startsWith('E') || msg.startsWith('W') ? 'c-red' : 'c-amber'}>{msg}</span>
            : mode === 'insert' ? <span className="c-bright">-- INSERT --</span> : <span>"{file}" [readonly] {content.length}L</span>}
        <span className="vim-pos">1,1{' '.repeat(10)}All</span>
      </div>
      <button type="button" className="program-exit" onClick={() => onQuit(false)}>[ kaçış kapısı ]</button>
    </div>
  );
};

export default Vim;
