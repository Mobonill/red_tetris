import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "../styles/solo.css";
import Game from "../components/Game";

function Solo() {
  const { pseudo = "" } = useParams<{ pseudo: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!pseudo) navigate("/");
  }, [pseudo, navigate]);

  return (
    <div>
      <Game mode="solo" pseudo={pseudo} />
    </div>
  );
}

export default Solo;
