/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Game.tsx                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: morgane <morgane@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/03/05 18:37:31 by morgane           #+#    #+#             */
/*   Updated: 2026/03/20 16:11:45 by morgane          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useState, useEffect, useRef } from "react";
import socket from "../socket";
import "../styles/Game.css";
import { Pieces } from "../../../server/srcs/classes/pieces";
import type { Grid2D, PieceType } from "../../../server/srcs/classes/types";
import type { PieceData } from "../types/PieceData";

export default function Game() {
  const [grid, setGrid] = useState<Grid2D>([]);
  const [pieceData, setPieceData] = useState<PieceData | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const hasJoined = useRef(false); // to not have x2 components like 2 solo games
  
  // receive state and put it on screen
  useEffect(() => {
    if (hasJoined.current) return;
    hasJoined.current = true;

    socket.emit("join_solo", { name: "Morgan" });

    socket.on("state", (data) => {
      setGrid(data.grid);
      setPieceData(data);
    });

    socket.on("game_over", () => {
      setGameOver(true);
    });
  }, []);

  const getMergedGrid = () => {
    const merged = grid.map((row) => [...row]);
    if (!pieceData) return merged;
    const shape = pieceData.shape;

    shape.forEach((row, dy) => {
      row.forEach((cell, dx) => {
        if (cell !== 0) {
          const newY = pieceData.position.y + dy;
          const newX = pieceData.position.x + dx;
          if (newY >= 0 && newY < 20 && newX >= 0 && newX < 10)
            merged[newY][newX] = cell;
        }
      });
    });

    return merged;
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      socket.emit("move", e.key);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const restart = () => {
    socket.disconnect();
    socket.connect();
    setGameOver(false);
  };

  return (
    <div className="game-container">
      <div className="grid">
        {getMergedGrid().map((row, y) => (
          <div key={y} className="row">
            {row.map((cell, x) => (
              <div
                key={x}
                className="cell"
                style={{
                  backgroundColor: cell
                    ? Pieces.COLORS[cell as PieceType]
                    : "black",
                }}
              />
            ))}
          </div>
        ))}
      </div>
      {gameOver && <div className="game-over">GAME OVER</div>}
      {gameOver && <button onClick={restart}>Rejouer</button>}
    </div>
  );
}
