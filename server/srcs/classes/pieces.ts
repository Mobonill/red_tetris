/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   pieces.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: morgane <morgane@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/03/05 16:54:51 by morgane           #+#    #+#             */
/*   Updated: 2026/03/05 18:29:31 by morgane          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { PieceType, Grid2D, Position } from "../types/types.js";

export class Pieces {
  private type: PieceType;
  private color: string;
  position: Position;
  private rotation: number;
  private shapes: Grid2D[];

  constructor() {
    const index = Math.floor(Math.random() * Pieces.TYPES.length);
    this.type = Pieces.TYPES[index];
    this.color = Pieces.COLORS[this.type];
    this.shapes = Pieces.SHAPES[this.type];
    this.rotation = 0;
    this.position = { x: 4, y: 0 };
  }

  rotate() {
    this.rotation = (this.rotation + 1) % this.shapes.length;
  }

  moveLeft() {
    this.position.x -= 1;
  }

  moveRight() {
    this.position.x += 1;
  }

  moveDown() {
    this.position.y -= 1;
  }
  getCurrentShape(): Grid2D {
    return this.shapes[this.rotation];
  }

  getType(): PieceType {
    return this.type;
  }
  getColor(): string {
    return this.color;
  }
  getPosition(): Position {
    return this.position;
  }

  static readonly TYPES: PieceType[] = ["I", "J", "L", "O", "S", "T", "Z"];
  static readonly COLORS: Record<PieceType, string> = {
    I: "cyan",
    J: "blue",
    L: "orange",
    O: "yellow",
    S: "green",
    T: "purple",
    Z: "red",
  };
  static readonly SHAPES: Record<PieceType, Grid2D[]> = {
    I: [
      [["I", "I", "I", "I"]], // rotation 0
      [["I"], ["I"], ["I"], ["I"]], // rotation 1
    ],
    J: [
      [
        ["J", 0, 0], // rotation 0
        ["J", "J", "J"],
      ],
      [
        [0, "J", "J"], // rotation 1
        [0, "J", 0],
        [0, "J", 0],
      ],
      [
        [0, 0, 0], // rotation 2
        ["J", "J", "J"],
        [0, 0, "J"],
      ],
      [
        [0, "J", 0], // rotation 3
        [0, "J", 0],
        ["J", "J", 0],
      ],
    ],
    L: [
      [
        [0, 0, "L"],
        ["L", "L", "L"],
      ],
      [
        ["L", "L"],
        [0, "L"],
        [0, "L"],
      ],
      [
        ["L", "L", "L"],
        ["L", 0, 0],
      ],
      [
        [0, "L"],
        [0, "L"],
        ["L", "L"],
      ],
    ],
    O: [
      [
        ["O", "O"],
        ["O", "O"],
      ],
    ],
    S: [
      [
        [0, "S", "S"],
        ["S", "S", 0],
      ],
      [
        ["S", 0],
        ["S", "S"],
        [0, "S"],
      ],
    ],
    T: [
      [
        [0, "T", 0],
        ["T", "T", "T"],
      ],
      [
        ["T", 0],
        ["T", "T"],
        ["T", 0],
      ],
      [
        ["T", "T", "T"],
        [0, "T", 0],
      ],
      [
        [0, "T"],
        ["T", "T"],
        [0, "T"],
      ],
    ],
    Z: [
      [
        ["Z", "Z", 0],
        [0, "Z", "Z"],
      ],
      [
        [0, "Z"],
        ["Z", "Z"],
        ["Z", 0],
      ],
    ],
  };
}
