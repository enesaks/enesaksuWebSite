import React, { useState, useEffect } from 'react';
import { BOOT } from '../data/constants';

interface BootScreenProps {
  onBootComplete: () => void;
}

const BootScreen: React.FC<BootScreenProps> = ({ onBootComplete }) => {
  const [bootLines, setBootLines] = useState<{ text: string; cls: string }[]>([]);

  useEffect(() => {
    let maxT = 0;
    BOOT.forEach(line => {
      maxT = Math.max(maxT, line.t);
      setTimeout(() => {
        setBootLines(prev => [...prev, { text: line.text || ' ', cls: line.cls }]);
      }, line.t);
    });
    setTimeout(() => onBootComplete(), maxT + 800);
  }, [onBootComplete]);

  return (
    <>
      <div className="scanline" />
      <div className="boot-screen">
        {bootLines.map((l, i) => <div key={i} className={l.cls}>{l.text}</div>)}
      </div>
    </>
  );
};

export default BootScreen;
