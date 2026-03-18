/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Game.tsx                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: morgane <morgane@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/03/05 18:37:31 by morgane           #+#    #+#             */
/*   Updated: 2026/03/18 23:06:17 by morgane          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useState, useEffect, useCallback } from "react";
import "../styles/Game.css";
import { Grid } from "../game/grid";
import { Pieces } from "../game/pieces";
import type { PieceType } from "../game/types";
// import { Grid2D } from "../game/types";

const TIME = 1500;

export default function Game() {
  const [grid, setGrid] = useState(new Grid());
  const [piece, setPiece] = useState(new Pieces());
  const [gameOver, setGameOver] = useState(false);

  console.log(piece);

  const getMergedGrid = () => {
    const merged = grid.getGrid().map((row) => [...row]);
    const shape = piece.getCurrentShape();

    shape.forEach((row, dy) => {
      row.forEach((cell, dx) => {
        if (cell !== 0) {
          const newY = piece.position.y + dy;
          const newX = piece.position.x + dx;
          if (newY >= 0 && newY < grid.rows && newX >= 0 && newX < grid.cols)
            merged[newY][newX] = cell;
        }
      });
    });

    return merged;
  };

  const isMoveValid = useCallback(
    (piece: Pieces): boolean => {
      const shape = piece.getCurrentShape();
      const x = piece.position.x;
      const y = piece.position.y;

      const result = shape.every((row, dy) => {
        return row.every((cell, dx) => {
          if (cell !== 0) {
            console.log(
              "checking",
              x + dx,
              y + dy,
              grid.isValidPosition(x + dx, y + dy),
            );
            if (!grid.isValidPosition(x + dx, y + dy)) return false;
          }
          return true;
        });
      });

      console.log("isMoveValid", result);
      return result;
    },
    [grid],
  );

  useEffect(() => {
    const timer = setInterval(() => {
      if (gameOver) return;

      const newPiece = piece.clone();
      newPiece.moveDown();

      if (isMoveValid(newPiece)) {
        setPiece(newPiece);
      } else {
        grid.lockPiece(piece);
        grid.clearLines();
        setGrid(grid.clone());
        const newPiece = new Pieces();
        if (!isMoveValid(newPiece)) setGameOver(true);
        setPiece(newPiece);
      }
    }, TIME);
    const handleKey = (e: KeyboardEvent) => {
      const newPiece = piece.clone();
      console.log(e.key);
      switch (e.key) {
        case "ArrowDown":
          newPiece.moveDown();
          if (!isMoveValid(newPiece)) newPiece.moveUp();
          break;

        case "ArrowLeft":
          newPiece.moveLeft();
          if (!isMoveValid(newPiece)) newPiece.moveRight();
          break;

        case "ArrowRight":
          newPiece.moveRight();
          if (!isMoveValid(newPiece)) newPiece.moveLeft();
          break;

        case "ArrowUp":
          newPiece.rotate();
          if (!isMoveValid(newPiece)) newPiece.unrotate();
          break;

        case " ":
          while (isMoveValid(newPiece)) {
            newPiece.moveDown();
          }
          newPiece.moveUp();
          grid.lockPiece(newPiece);
          grid.clearLines();
          setGrid(grid.clone());
          setPiece(new Pieces());
        
        // case "p":
      }
      setPiece(newPiece);
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      clearInterval(timer);
      window.removeEventListener("keydown", handleKey); // cleanup
    };
  }, [piece, isMoveValid, grid, gameOver]); // to recreate listener when the piece change and not reuse the initial piece.

  const restart = () => {
    setGrid(new Grid());
    setPiece(new Pieces());
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
