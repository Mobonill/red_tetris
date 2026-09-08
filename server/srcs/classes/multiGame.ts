/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   multiGame.ts                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: morgane <morgane@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/03/20 15:47:08 by morgane           #+#    #+#             */
/*   Updated: 2026/09/08 00:00:00 by morgane          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { RoomMulti } from "./roomMulti.js";

export class MultiGame extends RoomMulti {
  inProgress = false;
  private isLocked = new Map<string, boolean>();

  startGame(): void {
    for (const player of this.players) {
      player.grid.clearGrid();
      player.pieceIndex = 0;
      player.alive = true;
      this.isLocked.set(player.id, false);
      player.piece = this.spawnPieceForPlayer(player);
    }
    this.inProgress = true;
  }

  getStateForPlayer(playerId: string) {
    const player = this.players.find((p) => p.id === playerId);
    if (!player || !player.piece) return;

    return {
      grid: player.grid.getGrid(),
      shape: player.piece.getCurrentShape(),
      position: player.piece.getPosition(),
      color: player.piece.getColor(),
    };
  }

  handleMove(
    playerId: string,
    direction: string,
  ): "game_over" | "continue" | "error" {
    const player = this.players.find((p) => p.id === playerId);
    if (!player || !player.piece || !player.alive) return "error";

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
        if (this.isLocked.get(playerId)) return "continue";
        this.isLocked.set(playerId, true);
        while (player.grid.isPiecePositionValid(player.piece)) {
          player.piece.moveDown();
        }
        player.piece.moveUp();
        player.grid.lockPiece(player.piece);
        player.grid.clearLines();
        const nextPiece = this.spawnPieceForPlayer(player);
        this.isLocked.set(playerId, false);
        player.piece = nextPiece;
        if (!player.grid.isPiecePositionValid(nextPiece)) {
          player.alive = false;
          return "game_over";
        }
        return "continue";
      }
    }
    return "continue";
  }

  timerClock(playerId: string): "continue" | "game_over" | "error" {
    const player = this.players.find((p) => p.id === playerId);
    if (!player || !player.piece || !player.alive) return "error";

    player.piece.moveDown();
    if (!player.grid.isPiecePositionValid(player.piece)) {
      player.piece.moveUp();
      if (this.isLocked.get(playerId)) return "continue";
      this.isLocked.set(playerId, true);
      player.grid.lockPiece(player.piece);
      player.grid.clearLines();
      player.piece = this.spawnPieceForPlayer(player);
      this.isLocked.set(playerId, false);
      if (!player.grid.isPiecePositionValid(player.piece)) {
        player.alive = false;
        return "game_over";
      }
    }
    return "continue";
  }
}
