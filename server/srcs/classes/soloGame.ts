/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   soloGame.ts                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mobonill <mobonill@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/03/20 15:47:08 by morgane           #+#    #+#             */
/*   Updated: 2026/11/10 18:41:00 by mobonill         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { RoomSolo } from "./roomSolo.js";
import { saveScore } from "../db/directus.js";

// points according to the number of lines cleared at the same time
const POINTS = [0, 100, 300, 500, 800];

export class SoloGame extends RoomSolo {
  private gameOver = false;
  private isLocked = false;
  private timer: ReturnType<typeof setInterval> | null = null;
  private score = 0;
  private lines = 0;

  getState() {
    const player = this.players[0];
    if (!player.piece) return;

    return {
      grid: player.grid.getGrid(),
      shape: player.piece.getCurrentShape(),
      position: player.piece.getPosition(),
      color: player.piece.getColor(),
      score: this.score,
      lines: this.lines,
    };
  }

  // to clear won lines when they are complete
  private addClearedLines(cleared: number): void{
    this.lines += cleared;
    this.score += POINTS[cleared] ?? 0;
  }

  // to save the score at the end of the game
  private endGame(): "game_over" {
    if (!this.gameOver) {
      this.gameOver = true;
      this.isLocked = false;
      const player = this.players[0];
      void saveScore({
        player_name: player.name,
        score: this.score,
        lines: this.lines
      });
    }
    return "game_over";
  }

  handleMove(direction: string): "game_over" | "continue" | "error" {
    if (this.gameOver) return "game_over";

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
        if (this.isLocked) return "continue";

        // if the piece is not valid from the spawn, it's game over, not a hard drop
        if (!player.grid.isPiecePositionValid(player.piece)) return this.endGame();

        this.isLocked = true;
        while (player.grid.isPiecePositionValid(player.piece)) {
          player.piece.moveDown();
        }
        player.piece.moveUp();
        player.grid.lockPiece(player.piece);
        this.addClearedLines(player.grid.clearLines());

        const nextPiece = this.spawnPiece();
        player.piece = nextPiece;
        if (!player.grid.isPiecePositionValid(nextPiece)) return this.endGame();

        this.isLocked = false;
        return "continue";
      }
    }
    return "continue";
  }

  timerClock(): "continue" | "game_over" | "error" {
    if (this.gameOver) return "game_over";

    const player = this.players[0];
    if (!player.piece) return "error";

    player.piece.moveDown();
    if (!player.grid.isPiecePositionValid(player.piece)) {
      player.piece.moveUp();
      if (this.isLocked) return "continue";
      this.isLocked = true;
      player.grid.lockPiece(player.piece);
      this.addClearedLines(player.grid.clearLines());
      player.piece = this.spawnPiece();
      if (!player.grid.isPiecePositionValid(player.piece)) return this.endGame();
      this.isLocked = false;
    }
    return "continue";
  }
}