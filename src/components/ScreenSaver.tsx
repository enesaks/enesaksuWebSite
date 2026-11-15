import React, { useEffect, useRef } from 'react';
import { BANNER } from '../terminal/outputs';

const COLORS = ['#6cf58f', '#74e4ff', '#ffcf5c', '#ff7a6b', '#86b6ff', '#d3ffe0'];

/** Idle screen: the logo drifts around the tube and changes colour on every bounce. */
const ScreenSaver: React.FC<{ onQuit: () => void }> = ({ onQuit }) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const box = boxRef.current;
    const logo = logoRef.current;
    if (!box || !logo) return;

    let x = 20 + Math.random() * 60;
    let y = 20 + Math.random() * 60;
    let vx = 70;
    let vy = 52;
    let color = 0;
    let last = 0;
    let raf = 0;

    const frame = (t: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, last ? (t - last) / 1000 : 0);
      last = t;
      const maxX = box.clientWidth - logo.offsetWidth;
      const maxY = box.clientHeight - logo.offsetHeight;
      x += vx * dt;
      y += vy * dt;
      let bounced = false;
      if (x <= 0 || x >= maxX) { vx = x <= 0 ? Math.abs(vx) : -Math.abs(vx); x = Math.min(Math.max(x, 0), Math.max(0, maxX)); bounced = true; }
      if (y <= 0 || y >= maxY) { vy = y <= 0 ? Math.abs(vy) : -Math.abs(vy); y = Math.min(Math.max(y, 0), Math.max(0, maxY)); bounced = true; }
      if (bounced) { color = (color + 1) % COLORS.length; logo.style.color = COLORS[color]; }
      logo.style.transform = `translate(${x}px, ${y}px)`;
    };
    raf = requestAnimationFrame(frame);

    // Ignore the event that may have started the saver, then wake on any input.
    const wake = () => onQuit();
    const arm = setTimeout(() => {
      window.addEventListener('keydown', wake);
      window.addEventListener('pointerdown', wake);
    }, 250);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(arm);
      window.removeEventListener('keydown', wake);
      window.removeEventListener('pointerdown', wake);
    };
  }, [onQuit]);

  return (
    <div ref={boxRef} className="saver">
      <pre ref={logoRef} className="banner saver-logo" aria-hidden="true">{BANNER}</pre>
      <div className="saver-hint c-dim">uyandırmak için bir tuşa bas</div>
    </div>
  );
};

export default ScreenSaver;
