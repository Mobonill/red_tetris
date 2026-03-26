import './solo.css'
import { useState, useEffect, useRef } from 'react';
import { Routes, Route } from "react-router-dom";
import Game  from "./components/Game"
import socket from "./socket";

interface Player {
  id: string;
  pseudo: string;
  isHost: boolean;
}

interface MultiProps {
  onBack: () => void;
  pseudo:string;
  roomName: string;
}

function Multi({ onBack , roomName , pseudo }: MultiProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const hasJoined = useRef(false);
  
  useEffect(() => {
    if (hasJoined.current) return;
    hasJoined.current = true;

    socket.emit("join_multi", { name: pseudo, roomName });

    socket.on("room_update", (roomPlayers: Player[]) => {
      setPlayers(roomPlayers);
    });

    socket.on("game_started", () => {
      setGameStarted(true);
    });

    socket.on("error", (message: string) => {
      alert(message);
      onBack();
    });
  }, [pseudo, roomName]);


  const handleStart = () => {
    socket.emit("start_game", roomName);
  };

  const handleLeave = () => {
    socket.emit("leave_room", roomName);
    onBack();
  };

  //game comp
  if (gameStarted) {
    return (
      <Routes>
        <Route path="/" element={<Game mode="multi" pseudo={pseudo} roomName={roomName} />} />
      </Routes>
    );
  }

  //whos host
  const me = players.find(p => p.id === socket.id);
  const isHost = me?.isHost || false;

  //lobby
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
          disabled={players.length < 2}>
          {players.length < 2 ? "Waiting for 2nd player..." : "Start Game"}
        </button>
      ) : (
        <h4>Waiting for host to start the game...</h4>
      )}

      <button className="menu-button" onClick={handleLeave}>Leave Room</button>
    </div>
  );
}

export default Multi;
