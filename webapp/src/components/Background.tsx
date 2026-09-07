import { useState, useEffect } from "react";
import "../styles/Background.css";

export function LightUpBlocks() {
  const [cells, setCells] = useState<{id: number, color: string, x: number, y: number}[]>([]);
  
  useEffect(() => {
    const BLOCK = 50;
    const cols = Math.ceil(window.innerWidth / BLOCK);
    const rows = Math.ceil(window.innerHeight / BLOCK);
    const COLORS = ['#f71d00', '#f36100', '#ffd900', '#5eff00', '#00eeff', '#8c00ff'];
    
    const interval = setInterval(() => {
      const x = Math.floor(Math.random() * cols);
      const y = Math.floor(Math.random() * rows);
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const id = Date.now() + Math.random();
      
      setCells(prev => [...prev.slice(-30), { id, color, x, y }]);
    }, 400);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="blocks">
      {cells.map(cell => (
        <div key={cell.id} className="block-cell" style={{
          left: cell.x * 50,
          top: cell.y * 50,
          background: cell.color,
        }} />
      ))}
    </div>
  );
}


export function TetrisTitle() {
  return (
      <div className="tetris-title">
        <div className="letter" style={{ color: '#f71d00' }}>T</div>
        <div className="letter" style={{ color: '#f36100' }}>E</div>
        <div className="letter" style={{ color: '#ffd900' }}>T</div>
        <div className="letter" style={{ color: '#5eff00' }}>R</div>
        <div className="letter" style={{ color: '#00eeff' }}>I</div>
        <div className="letter" style={{ color: '#8c00ff' }}>S</div>
      </div>
  );
}