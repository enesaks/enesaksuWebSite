import React, { useState, useEffect, useRef } from 'react';

const S_COLS = 30;
const S_ROWS = 20;

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

interface SnakeGameProps {
  onQuit: () => void;
}

const SnakeGame: React.FC<SnakeGameProps> = ({ onQuit }) => {
  const gs    = useRef<GS>(mkGame());
  const [score, setScore] = useState(0);
  const [over,  setOver]  = useState(false);
  const [gkey,  setGkey]  = useState(0);
  const [screenText, setScreenText] = useState('');

  const buildScreen = (g: GS) => {
    let lines = [];
    // Üst kenarlık
    lines.push('+' + '-'.repeat(S_COLS) + '+');
    
    for (let y = 0; y < S_ROWS; y++) {
      let row = '|';
      for (let x = 0; x < S_COLS; x++) {
        let isHead = g.snake[0].x === x && g.snake[0].y === y;
        let isBody = false;
        for (let i = 1; i < g.snake.length; i++) {
          if (g.snake[i].x === x && g.snake[i].y === y) { isBody = true; break; }
        }
        let isFood = g.food.x === x && g.food.y === y;
        
        if (isHead) row += '█';
        else if (isBody) row += '▓';
        else if (isFood) row += '★';
        else row += ' '; // boş alan
      }
      row += '|';
      lines.push(row);
    }
    
    // Alt kenarlık
    lines.push('+' + '-'.repeat(S_COLS) + '+');
    return lines.join('\n');
  };

  /* game loop — re-runs on restart (gkey change) */
  useEffect(() => {
    gs.current = mkGame();
    gs.current.food = rndFood(gs.current.snake);
    setScore(0);
    setOver(false);
    setScreenText(buildScreen(gs.current));

    let id: number, last = 0;
    const spd = () => Math.max(75, 150 - gs.current.score * 5);

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
      setScreenText(buildScreen(g));
    };

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
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', overflow:'auto', padding:12,
      fontFamily:"'JetBrains Mono',monospace", width: '100%'
    }}>
      
      {/* header */}
      <div style={{ color:'#6cf58f', fontSize:12, letterSpacing:1, marginBottom:10 }}>
        {'SNAKE v1.0 (ASCII MODE)'}&nbsp;&nbsp;&nbsp;
        {'SCORE: '}<span style={{ color:'#6cf58f', fontWeight:'bold' }}>{score}</span>
        &nbsp;&nbsp;&nbsp;{'['}<span style={{ color:'#3f9a5a' }}>WASD / ARROWS</span>{']'}&nbsp;&nbsp;&nbsp;<button type="button" className="cmd-link" style={{ color:'#ff7a6b' }} onClick={onQuit}>[Q/ESC: QUIT]</button>
        {over && <span style={{ color: '#ffcf5c', fontWeight:'bold' }}> &nbsp;&nbsp;&nbsp;[R: RESTART]</span>}
      </div>

      {/* ascii canvas */}
      <div style={{ position:'relative', display:'inline-block' }}>
        <pre style={{
          margin: 0,
          color: '#6cf58f',
          background: 'transparent',
          padding: '10px',
          border: '1px solid #3f9a5a',
          lineHeight: '1.2',
          fontSize: '14px',
          fontWeight: 'bold',
          letterSpacing: '1px'
        }}>
          {screenText}
        </pre>
        
        {/* game over */}
        {over && (
          <div style={{
            position:'absolute', inset:0,
            display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
            background:'rgba(2,10,5,0.88)',
          }}>
            <div style={{ color:'#ff7a6b', fontSize:22, fontWeight:700, letterSpacing:5 }}>GAME OVER</div>
            <div style={{ color:'#3f9a5a', fontSize:12, marginTop:10 }}>
              {'FINAL SCORE: '}<span style={{ color:'#6cf58f' }}>{score}</span>
            </div>
            <div className="blink" style={{ marginTop:20, color:'#6cf58f', fontSize:11 }}>&gt; press R to restart</div>
          </div>
        )}
      </div>

      {/* legend */}
      <div style={{ color:'#3f9a5a', fontSize:11, letterSpacing:1, marginTop:10 }}>
        ★ <span style={{color: '#ffcf5c'}}>food</span> &nbsp;&nbsp;&nbsp; █▓ <span style={{color: '#6cf58f'}}>snake</span> &nbsp;&nbsp;&nbsp; (speed increases every 5 points)
      </div>
    </div>
  );
};

export default SnakeGame;
