/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   pieces.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: morgane <morgane@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/03/05 16:54:51 by morgane           #+#    #+#             */
/*   Updated: 2026/09/10 15:09:01 by morgane          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import type { PieceType, Grid2D, Position } from "./types.js";

export class Pieces {
  protected type: PieceType;
  protected color: string;
  public position: Position;
  protected rotation: number;
  protected shapes: Grid2D[];

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

  unrotate() {
    this.rotation =
      (this.rotation - 1 + this.shapes.length) % this.shapes.length;
  }

  moveLeft() {
    this.position.x -= 1;
  }

  moveRight() {
    this.position.x += 1;
  }

  moveDown() {
    this.position.y += 1;
  }

  moveUp() {
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

  clone(): Pieces {
    const p = new Pieces();
    p.position = { ...this.position };
    p.color = this.color;
    p.type = this.type;
    p.shapes = [...this.shapes];
    p.rotation = this.rotation;

    return p;
  }

  static fromType(type: PieceType): Pieces {
    const p = new Pieces();
    p.type = type;
    p.color = Pieces.COLORS[type];
    p.shapes = Pieces.SHAPES[type];
    return p;
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
      [
        [0, 0, 0, 0],
        ["I", "I", "I", "I"],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ], // 0
      [
        [0, 0, "I", 0],
        [0, 0, "I", 0],
        [0, 0, "I", 0],
        [0, 0, "I", 0],
      ], // 1
      [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        ["I", "I", "I", "I"],
        [0, 0, 0, 0],
      ], // 2 (décalée d'une ligne vers le bas par rapport à 0)
      [
        [0, "I", 0, 0],
        [0, "I", 0, 0],
        [0, "I", 0, 0],
        [0, "I", 0, 0],
      ], // 3 (décalée d'une colonne vers la gauche par rapport à 1)
    ],

    S: [
      [
        [0, "S", "S"],
        ["S", "S", 0],
        [0, 0, 0],
      ], // 0
      [
        [0, "S", 0],
        [0, "S", "S"],
        [0, 0, "S"],
      ], // 1
      [
        [0, 0, 0],
        [0, "S", "S"],
        ["S", "S", 0],
      ], // 2 (décalée vers le bas par rapport à 0)
      [
        ["S", 0, 0],
        ["S", "S", 0],
        [0, "S", 0],
      ], // 3 (décalée vers la gauche par rapport à 1)
    ],

    Z: [
      [
        ["Z", "Z", 0],
        [0, "Z", "Z"],
        [0, 0, 0],
      ], // 0
      [
        [0, 0, "Z"],
        [0, "Z", "Z"],
        [0, "Z", 0],
      ], // 1
      [
        [0, 0, 0],
        ["Z", "Z", 0],

        [0, "Z", "Z"],
      ], // 2 (décalée vers le bas par rapport à 0)
      [
        [0, "Z", 0],
        ["Z", "Z", 0],
        ["Z", 0, 0],
      ], // 3 (décalée vers la gauche par rapport à 1)
    ],
    J: [
      [
        ["J", 0, 0],
        ["J", "J", "J"],
      ],
      [
        [0, "J", "J"],
        [0, "J", 0],
        [0, "J", 0],
      ],
      [
        [0, 0, 0],
        ["J", "J", "J"],
        [0, 0, "J"],
      ],
      [
        [0, "J", 0],
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
      ], // 0
      [
        ["O", "O"],
        ["O", "O"],
      ], // 1 (same)
      [
        ["O", "O"],
        ["O", "O"],
      ], // 2 (same)
      [
        ["O", "O"],
        ["O", "O"],
      ], // 3 (same)
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
  };
}

// const pieces = new Pieces();
