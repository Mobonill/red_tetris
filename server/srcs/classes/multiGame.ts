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
import type { Grid } from "./grid.js";
import type { Pieces } from "./pieces.js";
import type { Grid2D } from "./types.js";

// Which rows actually contain at least one locked block, at their real
// position. Used to show the opponent only a grey silhouette of the stack's
// shape, not the actual board content (piece colors, columns, gaps).
function getOccupiedRows(grid: Grid2D): boolean[] {
  return grid.map((row) => row.some((cell) => cell !== 0));
}

// A piece that can't fully fit at spawn still behaves like every other
// piece: it falls in from above the visible board and settles the instant
// its in-bounds part would collide. This moves it up out of an invalid
// spawn until only the part that's actually on the board is colliding with
// nothing, so just that part renders (like real Tetris's hidden spawn rows).
function settlePieceAboveBoard(piece: Pieces, grid: Grid): void {
  while (!grid.isPiecePositionValidAllowingOverflow(piece)) {
    piece.moveUp();
  }
}

export class MultiGame extends RoomMulti {
  inProgress = false;
  private isLocked = new Map<string, boolean>();

  startGame(): void {
    this.resetPieceSequence();
    for (const player of this.players) {
      player.grid.clearGrid();
      player.pieceIndex = 0;
      player.alive = true;
      player.readyToRestart = false;
      this.isLocked.set(player.id, false);
      player.piece = this.spawnPieceForPlayer(player);
    }
    this.inProgress = true;
  }

  getStateForPlayer(playerId: string) {
    const player = this.players.find((p) => p.id === playerId);
    if (!player || !player.piece) return;

    const opponent = this.players.find((p) => p.id !== playerId);
    // Once the opponent has topped out, show them as fully covered rather
    // than mirroring their locked grid, which never includes the final
    // piece that couldn't actually be placed.
    const opponentRows = !opponent
      ? []
      : opponent.alive
        ? getOccupiedRows(opponent.grid.getGrid())
        : opponent.grid.getGrid().map(() => true);

    return {
      grid: player.grid.getGrid(),
      shape: player.piece.getCurrentShape(),
      position: player.piece.getPosition(),
      color: player.piece.getColor(),
      opponentRows,
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
          settlePieceAboveBoard(nextPiece, player.grid);
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
        settlePieceAboveBoard(player.piece, player.grid);
        player.alive = false;
        return "game_over";
      }
    }
    return "continue";
  }
}
