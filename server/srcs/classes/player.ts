/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   player.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: morgane <morgane@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/03/20 12:52:20 by morgane           #+#    #+#             */
/*   Updated: 2026/04/08 10:52:44 by morgane          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Pieces } from "./pieces.js";
import { Grid } from "./grid.js";

export class Player {
  readonly id: string;
  name: string;
  isHost: boolean;
  grid: Grid;
  piece: Pieces | null = null;
  score: number;
  isConnected: boolean;
  pieceIndex: number;
  alive: boolean;

  constructor(socketId: string, name: string, isHost: boolean = false) {
    this.id = socketId;
    this.name = name;
    this.grid = new Grid();
    this.score = 0;
    this.isConnected = true;
    this.isHost = isHost;
    this.pieceIndex = 0;
    this.alive = true;
  }
}
