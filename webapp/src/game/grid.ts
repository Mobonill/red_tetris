/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   grid.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: morgane <morgane@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/03/05 16:06:39 by morgane           #+#    #+#             */
/*   Updated: 2026/03/05 19:19:40 by morgane          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import type { Grid2D } from "./types";

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
}

const grid = new Grid();
