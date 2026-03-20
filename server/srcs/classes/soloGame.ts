/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   soloGame.ts                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: morgane <morgane@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/03/20 15:47:08 by morgane           #+#    #+#             */
/*   Updated: 2026/03/20 16:59:15 by morgane          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Room } from "./room.js";

export class SoloGame extends Room {
  private gameOver = false;
  private isLocked = false;
  private timer: ReturnType<typeof setInterval> | null = null;

  getState() {
    const player = this.players[0];
    if (!player.piece) return;

    return {
      grid: player.grid.getGrid(),
      shape: player.piece.getCurrentShape(),
      position: player.piece.getPosition(),
      color: player.piece.getColor(),
    };
  }

  handleMove(direction: string): "game_over" | "continue" | "error" {
    const player = this.players[0];
    if (!player.piece) return "error";

    switch (direction) {
      case "ArrowLeft":
        player.piece.moveLeft();
        if (!player.grid.isPiecePositionValid(player.piece))
          player.piece.moveRight();
        break;

      case "ArrowRight":
        player.piece.moveRight();
        if (!player.grid.isPiecePositionValid(player.piece))
          player.piece.moveLeft();
        break;

      case "ArrowDown":
        player.piece.moveDown();
        if (!player.grid.isPiecePositionValid(player.piece))
          player.piece.moveUp();
        break;

      case "ArrowUp":
        player.piece.rotate();
        if (!player.grid.isPiecePositionValid(player.piece)) {
          player.piece.moveLeft();
          if (!player.grid.isPiecePositionValid(player.piece)) {
            player.piece.moveRight();
            player.piece.moveRight();
            if (!player.grid.isPiecePositionValid(player.piece)) {
              player.piece.moveLeft();
              player.piece.unrotate();
            }
          }
        }
        break;

      case " ": {
        if (this.isLocked || this.gameOver) return "game_over";
        this.isLocked = true;
        while (player.grid.isPiecePositionValid(player.piece)) {
          player.piece.moveDown();
        }
        player.piece.moveUp();
        player.grid.lockPiece(player.piece);
        player.grid.clearLines();
        const nextPiece = this.spawnPiece();
        if (!player.grid.isPiecePositionValid(nextPiece)) {
          // clearInterval(timer);
        }
        player.piece = nextPiece;
        this.isLocked = false;
        return "continue";
      }
    }
    return "continue";
  }

  timerClock(): "continue" | "game_over" | "error" {
    const player = this.players[0];
    if (!player.piece) return "error";


    if (this.gameOver) {
      return "game_over";
    }
    player.piece.moveDown();
    if (!player.grid.isPiecePositionValid(player.piece)) {
      player.piece.moveUp();
      if (this.isLocked) return "continue";
      this.isLocked = true;
      player.grid.lockPiece(player.piece);
      player.grid.clearLines();
      player.piece = this.spawnPiece();
      if (!player.grid.isPiecePositionValid(player.piece)) {
        this.gameOver = true;
        this.isLocked = false;
        return "continue";
      }
      this.isLocked = false;
    }
    return "continue";
  }
}
