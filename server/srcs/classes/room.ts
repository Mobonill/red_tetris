/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   room.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: morgane <morgane@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/03/20 14:16:35 by morgane           #+#    #+#             */
/*   Updated: 2026/03/20 16:51:47 by morgane          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Player } from "./player.js";
import { PIECE_TYPES, PieceType } from "./types.js";
import { Pieces } from "./pieces.js";

export abstract class Room {
  readonly id: string;
  players: Player[];
  private bag: PieceType[];
  private bagIndex: number = 0;

  constructor(id: string) {
    this.id = id;
    this.players = [];
    this.bag = this._generateBag();
  }

  private _generateBag(): PieceType[] {
    const piecesTab = [...PIECE_TYPES];

    for (let i = piecesTab.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = piecesTab[i];
      piecesTab[i] = piecesTab[j];
      piecesTab[j] = temp;
    }
    return piecesTab;
  }

  getNextPiece(): PieceType {
    if (this.bagIndex >= this.bag.length) {
      this.bag = this._generateBag();
      this.bagIndex = 0;
    }
    return this.bag[this.bagIndex++];
  }

  spawnPiece(): Pieces {
    const type = this.getNextPiece();
    console.log("next piece:", type);
    return Pieces.fromType(type);
  }
}
