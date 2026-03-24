/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   player.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: morgane <morgane@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/03/20 12:52:20 by morgane           #+#    #+#             */
/*   Updated: 2026/03/20 16:57:20 by morgane          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Pieces } from "./pieces.js";
import { Grid } from "./grid.js";

export class Player {
  readonly id: string;
  name: string;
  role: string;
  grid: Grid;
  piece: Pieces | null = null;;
  score: number;
  isConnected: boolean;

  constructor(socketId: string, name: string) {
    this.id = socketId;
    this.name = name;
    this.grid = new Grid();
    this.score = 0;
    this.isConnected = true;
    this.role = "guest";
  }
}
