/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   grid.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: morgane <morgane@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/03/05 16:06:39 by morgane           #+#    #+#             */
/*   Updated: 2026/03/20 11:12:18 by morgane          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import type { Pieces } from "./pieces.js";
import type { Grid2D, Cell } from "./types.js";

const ROWS = 20;
const COLS = 10;

export class Grid {
  private grid: Grid2D;
  readonly rows: number;
  readonly cols: number;

  constructor(rows = ROWS, cols = COLS) {
    this.rows = rows;
    this.cols = cols;
    this.grid = this._createGrid();
  }

  private _createGrid(): Grid2D {
    return Array.from({ length: this.rows }, () =>
      Array.from({ length: this.cols }, () => 0),
    );
  }

  clearGrid() {
    this.grid = this._createGrid();
  }

  getGrid(): Grid2D {
    return this.grid;
  }

  lockPiece(piece: Pieces): void {
    const shape = piece.getCurrentShape();
    const y = piece.position.y;
    const x = piece.position.x;

    shape.forEach((row, dy) => {
      row.forEach((cell, dx) => {
        if (cell !== 0) this.grid[y + dy][x + dx] = cell;
      });
    });
  }

  clone(): Grid {
    const g = new Grid(this.rows, this.cols);
    g.setGrid(this.getGrid());
    return g;
  }

  setGrid(newGrid: Grid2D): void {
    this.grid = newGrid;
  }

  isPiecePositionValid(piece: Pieces): boolean {
    const x = piece.position.x;
    const y = piece.position.y;
    const shape = piece.getCurrentShape();

    return shape.every((row, dy) => {
      return row.every((cell, dx) => {
        if (cell !== 0) {
          if (!this.isValidPosition(x + dx, y + dy)) return false;
        }
        return true;
      });
    });
  }

  isValidPosition(x: number, y: number): boolean {
    if (
      x >= 0 &&
      x < this.cols &&
      y >= 0 &&
      y < this.rows &&
      this.grid[y][x] === 0
    )
      return true;
    return false;
  }

  clearLines() {
    const newGrid = this.grid.filter((row) => !row.every((cell) => cell !== 0));
    const cleanedLines = this.rows - newGrid.length;
    const addLines = Array.from({ length: cleanedLines }, () =>
      Array.from({ length: this.cols }, (): Cell => 0),
    );

    this.grid = [...addLines, ...newGrid];
  }
}
