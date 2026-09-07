import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { LightUpBlocks, TetrisTitle } from "../components/Background";

function Login() {
  const [pseudo, setPseudo] = useState("");
  const navigate = useNavigate();

  // useEffect(() => {
  //   const saved = localStorage.getItem('pseudo');
  //   if (saved) navigate('/home');
  // }, []);

  const goHome = () => {
    if (!pseudo.trim()) return alert("Entre un pseudo");
    localStorage.setItem("pseudo", pseudo);
    navigate("/home");
  };

  return (
    <div className="page">
      <LightUpBlocks />
      <div className="page-content">
        <TetrisTitle />
        <div className="pseudo-block">
          <input
            type="text"
            placeholder="Ton pseudo..."
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
          />
          <button onClick={goHome}>Jouer</button>
        </div>
      </div>
    </div>
  );
}

export default Login;
