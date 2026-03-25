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
import { MultiGame } from "../classes/multiGame.js";

const activeMultiRooms = new Map<string, MultiGame>();

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


    socket.on("join_multi", (data: { name: string; roomName: string }) => {

      let room = activeMultiRooms.get(data.roomName);

      if (room && room.players.length >= 2) {
        socket.emit("error", "This room is already full.");
        console.log(`user ${socket.id} tried connect to room ${data.roomName} but room is already full`);
        console.log(`room length : ${room.players.length}`);
        return;
      }

      if (!room) {
        room = new MultiGame(data.roomName);
        activeMultiRooms.set(data.roomName, room);
      }

      const isHost = room.players.length === 0;
      const player = new Player(socket.id, data.name, isHost);
      room.players.push(player);

      socket.join(data.roomName);
      socket.emit("room_joined", data.roomName);
      console.log(`user ${socket.id} connected to room ${data.roomName}`);
      console.log(`room length : ${room.players.length}`);
      console.log(`players : ${room.players}`);




      socket.on("disconnect", () => {
        console.log(`user ${socket.id} disconnected from room ${data.roomName}`);
        
        if (!room) return;

        const leavingPlayer = room.players.find(p => p.id === socket.id);
        const wasHost = leavingPlayer?.isHost;

        room.players = room.players.filter(p => p.id !== socket.id);
        console.log(`room length : ${room.players.length}`);
        
        if (room.players.length === 0) {
          activeMultiRooms.delete(data.roomName);
        }
        else {
          if (wasHost && room.players.length > 0) {
            room.players[0].isHost = true;
          }
        }
      });
    });

    


  });
}
