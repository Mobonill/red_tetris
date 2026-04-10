import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

function LightUpBlocks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const BLOCK = 50;
    const COLORS = ['#f71d00', '#f36100', '#ffd900', '#5eff00', '#00eeff', '#8c00ff'];

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let tick = 0;
    let raf: number;

    const animate = () => {
      tick++;

      if (tick % 10 === 0) { // toutes les 20 frames
        ctx.fillStyle = 'rgba(3, 3, 5, 0.3)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const x = Math.floor(Math.random() * (canvas.width / BLOCK)) * BLOCK;
        const y = Math.floor(Math.random() * (canvas.height / BLOCK)) * BLOCK;
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        ctx.globalAlpha = 0.7;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, BLOCK - 2, BLOCK - 2);
        ctx.globalAlpha = 1;
      }

      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={canvasRef} className="blocks-canvas" />;
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
