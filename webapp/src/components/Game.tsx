/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Game.tsx                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: morgane <morgane@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/03/05 18:37:31 by morgane           #+#    #+#             */
/*   Updated: 2026/03/18 16:02:42 by morgane          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useState, useEffect } from "react";
import "../styles/Game.css";
import { Grid } from "../game/grid";
import { Pieces } from "../game/pieces";
import type { PieceType } from "../game/types";
// import { Grid2D } from "../game/types";

export default function Game() {
  const [grid, setGrid] = useState(new Grid());
  const [piece, setPiece] = useState(new Pieces());

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

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const newPiece = piece.clone();

      switch (e.key) {
        case "ArrowDown":
          newPiece.moveDown();
          break;

        case "ArrowLeft":
          newPiece.moveLeft();
          break;

        case "ArrowRight":
          newPiece.moveRight();
          break;
      }
      setPiece(newPiece);
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey); // cleanup
    };
  }, [piece]); // to recreate listener when the piece change and not reuse the initial piece.

  return (
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
  );
}
