import React, { useState, useEffect, useRef } from 'react';
import { BOOT } from '../data/constants';

interface BootScreenProps {
  onBootComplete: () => void;
}

const BootScreen: React.FC<BootScreenProps> = ({ onBootComplete }) => {
  const [visible, setVisible] = useState(0);

  // Keep the latest callback without re-running the boot sequence when the parent re-renders.
  const doneRef = useRef(onBootComplete);
  doneRef.current = onBootComplete;

  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { doneRef.current(); return; }

    const maxT = Math.max(...BOOT.map(l => l.t));
    const timers = BOOT.map((line, i) => setTimeout(() => setVisible(i + 1), line.t));
    timers.push(setTimeout(() => doneRef.current(), maxT + 700));

    const skip = () => doneRef.current();
    window.addEventListener('keydown', skip);
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener('keydown', skip);
    };
  }, []);

  return (
    <div className="boot-screen" onClick={() => doneRef.current()}>
      {BOOT.slice(0, visible).map((l, i) => <div key={i} className={l.cls}>{l.text}</div>)}
      <div className="boot-skip">geçmek için tıkla ya da bir tuşa bas</div>
    </div>
  );
};

export default BootScreen;
