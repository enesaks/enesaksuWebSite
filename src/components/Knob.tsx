import React, { useRef } from 'react';

interface KnobProps {
  label: string;
  value: number;               // 0..1
  onChange: (value: number) => void;
}

const clamp = (v: number) => Math.min(1, Math.max(0, v));

/** Rotary knob on the monitor casing: drag up/down, scroll, or use the arrow keys. */
const Knob: React.FC<KnobProps> = ({ label, value, onChange }) => {
  const drag = useRef<{ y: number; start: number } | null>(null);

  return (
    <button
      type="button"
      className="knob"
      role="slider"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value * 100)}
      title={`${label}: sürükle, kaydır ya da ok tuşları`}
      style={{ '--rot': `${-135 + value * 270}deg` } as React.CSSProperties}
      onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); drag.current = { y: e.clientY, start: value }; }}
      onPointerMove={e => { if (drag.current) onChange(clamp(drag.current.start + (drag.current.y - e.clientY) / 110)); }}
      onPointerUp={() => { drag.current = null; }}
      onPointerCancel={() => { drag.current = null; }}
      onWheel={e => onChange(clamp(value + (e.deltaY < 0 ? 0.06 : -0.06)))}
      onDoubleClick={() => onChange(0.5)}
      onKeyDown={e => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowRight') { e.preventDefault(); onChange(clamp(value + 0.05)); }
        if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') { e.preventDefault(); onChange(clamp(value - 0.05)); }
      }}
    />
  );
};

export default Knob;
