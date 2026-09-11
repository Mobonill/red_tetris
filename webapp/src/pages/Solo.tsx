import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "../styles/solo.css";
import Game from "../components/Game";
import { LightUpBlocks, TetrisTitle } from "../components/Background";


function Solo() {
  const { pseudo = "" } = useParams<{ pseudo: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!pseudo) navigate("/");
  }, [pseudo, navigate]);

   return (
    <div className="page">
      <div className="login-page">
        <LightUpBlocks />
        <div className="page-title">
          <TetrisTitle />
        </div>
        <Game mode="solo" pseudo={pseudo} />
      </div>
    </div>
  );
}

export default Solo;