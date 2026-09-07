import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import { LightUpBlocks, TetrisTitle } from "../components/Background";

function Home() {
  const [pseudo] = useState(() => localStorage.getItem("pseudo") ?? "");
  const [roomName, setRoomName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!pseudo) navigate("/");
  }, [pseudo, navigate]);

  const goSolo = () => {
    navigate(`/solo/${pseudo}`);
  };

  const goMulti = () => {
    if (!roomName.trim()) return alert("Entre un nom de room");
    navigate(`/${roomName}/${pseudo}`);
  };

  return (
    <div className="page">
      <div className="login-page">
        <LightUpBlocks />
        <div className="page-title">
          <TetrisTitle />
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
      </div>
    </div>
  );
}

export default Home;
