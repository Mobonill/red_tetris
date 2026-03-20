/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   socket.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: morgane <morgane@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/03/20 12:19:13 by morgane           #+#    #+#             */
/*   Updated: 2026/03/20 17:00:22 by morgane          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Server } from "socket.io";

import { Player } from "../classes/player.js";
import { SoloGame } from "../classes/soloGame.js";

export function initSocket(io: Server) {
  io.on("connection", (socket) => {
    console.log("user connected: ", socket.id);

    socket.on("join_solo", (data: { name: string }) => {
      const player = new Player(socket.id, data.name);
      const room = new SoloGame(socket.id);
      room.players.push(player);
      player.piece = room.spawnPiece();

      const timer = setInterval(() => {
        const result = room.timerClock();
        if (result === "game_over") socket.emit("game_over");
        else socket.emit("state", room.getState());
      }, 1200);

      socket.on("move", (direction: string) => {
        const result = room.handleMove(direction);
        if (result === "game_over") socket.emit("game_over");
        else if (result === "error") socket._error("Error: ");
        else socket.emit("state", room.getState());
      });

      socket.on("disconnect", () => {
        clearInterval(timer);
        console.log("user disconnected: ", socket.id);
      });
    });
  });
}
