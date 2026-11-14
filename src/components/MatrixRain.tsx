import React, { useEffect, useRef } from 'react';

interface MatrixRainProps {
  onQuit: () => void;
}

const MatrixRain: React.FC<MatrixRainProps> = ({ onQuit }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレゲゼデベペオォコソトノホモヨョロゴゾドボポヴッン';
    const alphabet = katakana + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + '0123456789';
    const fontSize = 16;
    let drops: number[] = [];

    // The rain fills the monitor's tube, not the browser window.
    const fit = () => {
      const box = canvas.parentElement;
      canvas.width = box ? box.clientWidth : window.innerWidth;
      canvas.height = box ? box.clientHeight : window.innerHeight;
      drops = Array.from({ length: Math.ceil(canvas.width / fontSize) }, () => 1);
    };
    fit();

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#5dff8a';
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);
    window.addEventListener('resize', fit);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key.toLowerCase() === 'q') onQuit();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', fit);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onQuit]);

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'black' }}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />
      <button type="button" className="program-exit" onClick={onQuit}>[ ESC / Q: çık ]</button>
    </div>
  );
};

export default MatrixRain;
