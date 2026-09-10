import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/solo.css";
import Game from "../components/Game";
import socket from "../socket";

interface Player {
  id: string;
  pseudo: string;
  isHost: boolean;
  readyToRestart: boolean;
}

function Multi() {
  const { pseudo = "", roomName = "" } = useParams<{
    pseudo: string;
    roomName: string;
  }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!pseudo) navigate("/");
  }, [pseudo, navigate]);

  const [players, setPlayers] = useState<Player[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const hasJoined = useRef(false);
  const hasLeft = useRef(false);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // We're (re)mounting, so any leave scheduled by a previous cleanup
    // (StrictMode's synthetic unmount, most likely) should not fire.
    if (leaveTimer.current !== null) {
      clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }

    const handleRoomUpdate = (roomPlayers: Player[]) => {
      setPlayers(roomPlayers);
    };
    const handleGameStarted = () => {
      setGameStarted(true);
    };
    const handleError = (message: string) => {
      alert(message);
      navigate("/home");
    };

    socket.on("room_update", handleRoomUpdate);
    socket.on("game_started", handleGameStarted);
    socket.on("error", handleError);

    if (!hasJoined.current) {
      hasJoined.current = true;
      socket.emit("join_multi", { name: pseudo, roomName });
    }

    return () => {
      // socket.off(event) with no handler would also strip Game.tsx's own
      // "game_started" listener, since they share the same socket singleton.
      socket.off("room_update", handleRoomUpdate);
      socket.off("game_started", handleGameStarted);
      socket.off("error", handleError);

      // Deferred so a StrictMode synthetic remount (which runs synchronously
      // right after this) can cancel it above before it ever fires. If this
      // really is a real unmount (navigating away, incl. the browser back
      // button), nothing cancels it and the room gets a proper leave.
      if (!hasLeft.current) {
        leaveTimer.current = setTimeout(() => {
          if (!hasLeft.current) {
            hasLeft.current = true;
            socket.emit("leave_room", roomName);
          }
        }, 0);
      }
    };
  }, [pseudo, roomName, navigate]);

  const handleStart = () => {
    socket.emit("start_game", roomName);
  };

  const handleRestart = () => {
    socket.emit("restart_game", roomName);
  };

  const handleLeave = () => {
    hasLeft.current = true;
    socket.emit("leave_room", roomName);
    navigate("/home");
  };

  if (gameStarted) {
    const me = players.find((p) => p.id === socket.id);
    const opponent = players.find((p) => p.id !== socket.id);
    return (
      <Game
        mode="multi"
        pseudo={pseudo}
        roomName={roomName}
        onExit={handleLeave}
        onRestart={handleRestart}
        hasOpponent={!!opponent}
        iAmReadyToRestart={me?.readyToRestart ?? false}
        opponentReadyToRestart={opponent?.readyToRestart ?? false}
      />
    );
  }

  const me = players.find((p) => p.id === socket.id);
  const isHost = me?.isHost ?? false;

  return (
    <div className="app-container">
      <h2>Room: {roomName}</h2>
      <div>
        <h3>Players ({players.length}/2)</h3>
      </div>
      {isHost ? (
        <button
          className="menu-button"
          onClick={handleStart}
          disabled={players.length < 2}
        >
          {players.length < 2 ? "Waiting for 2nd player..." : "Start Game"}
        </button>
      ) : (
        <h4>Waiting for host to start the game...</h4>
      )}
      <button className="menu-button" onClick={handleLeave}>
        Leave Room
      </button>
    </div>
  );
}

export default Multi;
