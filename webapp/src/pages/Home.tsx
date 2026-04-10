import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

function LightUpBlocks() {
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

function Home() {
  const [pseudo, setPseudo] = useState("");
  const [roomName, setRoomName] = useState("");
  const navigate = useNavigate();

  const goSolo = () => {
    if (!pseudo.trim()) return alert("Entre un pseudo");
    navigate(`/solo/${pseudo}`);
  };

  const goMulti = () => {
    if (!pseudo.trim() || !roomName.trim())
      return alert("Entre un pseudo et un nom de room");
    navigate(`/${roomName}/${pseudo}`);
  };

  return (
    <div className="page">
        <LightUpBlocks />
      <div className="tetris-title">
        <div className="letter" style={{ color: '#f71d00' }}>T</div>
  <div className="letter" style={{ color: '#f36100' }}>E</div>
  <div className="letter" style={{ color: '#ffd900' }}>T</div>
  <div className="letter" style={{ color: '#5eff00' }}>R</div>
  <div className="letter" style={{ color: '#00eeff' }}>I</div>
  <div className="letter" style={{ color: '#8c00ff' }}>S</div>
      </div>

      <div className="pseudo-button">
        <input
          type="text"
          placeholder="Ton pseudo..."
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value)}
        />
      </div>

      <div className="cards">
        <div className="glass-card">
          <p className="card-title">Solo</p>
          <p className="card-desc">Joue seul, bats ton record.</p>
          <button className="card-btn btn-solo" onClick={goSolo}>
            Jouer
          </button>
        </div>

        <div className="glass-card">
          <p className="card-title">Multijoueur</p>
          <p className="card-desc">Affronte un ami en temps réel.</p>
          <input
            className="card-input"
            type="text"
            placeholder="Nom de la room..."
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
          <button className="card-btn btn-multi" onClick={goMulti}>
            Rejoindre
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
