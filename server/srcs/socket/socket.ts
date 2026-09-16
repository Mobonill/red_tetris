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
const roomTimers = new Map<string, ReturnType<typeof setInterval>>();

function endMultiGameIfOver(io: Server, room: MultiGame) {
  if (!room.inProgress) return;

  const alivePlayers = room.players.filter((p) => p.alive);
  if (alivePlayers.length > 1) return;

  room.inProgress = false;
  const timer = roomTimers.get(room.id);
  if (timer) {
    clearInterval(timer);
    roomTimers.delete(room.id);
  }

  if (alivePlayers.length === 1) {
    const winner = alivePlayers[0];
    // Whichever path ended the match, this may be the winner's only chance
    // to see the opponent's board flip to fully grey before the tick loop
    // stops for good.
    io.to(winner.id).emit("state", room.getStateForPlayer(winner.id));
    io.to(winner.id).emit("game_won");
  }
  room.players
    .filter((p) => !p.alive)
    .forEach((p) => {
      io.to(p.id).emit("game_over");
    });
}

function beginMatch(io: Server, room: MultiGame, roomName: string) {
  room.startGame();
  io.to(roomName).emit("room_update", room.players);
  io.to(roomName).emit("game_started");
  console.log(`Game started in room: ${roomName}`);

  const timer = setInterval(() => {
    for (const player of room.players) {
      if (!player.alive) continue;
      room.timerClock(player.id);
      // Emitted even if this tick just made them top out, so their client
      // renders the final locked board (with the piece that ended it)
      // before "game_over" arrives.
      io.to(player.id).emit("state", room.getStateForPlayer(player.id));
    }

    endMultiGameIfOver(io, room);
  }, 1200);
  roomTimers.set(roomName, timer);
}

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
        console.log(
          `user ${socket.id} tried connect to room ${data.roomName} but room is already full`,
        );
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
      io.to(data.roomName).emit("room_update", room.players);

      socket.on("move", (direction: string) => {
        if (!room || !room.inProgress) return;
        const result = room.handleMove(socket.id, direction);
        if (result === "game_over") {
          // Same reasoning as the tick loop: send the final locked board
          // before "game_over" so the last piece isn't missing on screen.
          socket.emit("state", room.getStateForPlayer(socket.id));
          endMultiGameIfOver(io, room);
        } else if (result === "continue") {
          socket.emit("state", room.getStateForPlayer(socket.id));
        }
      });

      socket.on("disconnect", () => {
        console.log(
          `user ${socket.id} disconnected from room ${data.roomName}`,
        );

        if (!room) return;

        const leavingPlayer = room.players.find((p) => p.id === socket.id);
        const wasHost = leavingPlayer?.isHost;
        const wasInProgress = room.inProgress;

        room.players = room.players.filter((p) => p.id !== socket.id);
        console.log(`room length : ${room.players.length}`);

        if (room.players.length === 0) {
          activeMultiRooms.delete(data.roomName);
        } else {
          if (wasHost && room.players.length > 0) {
            room.players[0].isHost = true;
          }
        }
        io.to(data.roomName).emit("room_update", room.players);

        if (wasInProgress) {
          endMultiGameIfOver(io, room);
        }
      });
    });

    socket.on("start_game", (roomName: string) => {
      const room = activeMultiRooms.get(roomName);

      if (room) {
        const requestingPlayer = room.players.find((p) => p.id === socket.id);

        if (
          requestingPlayer &&
          requestingPlayer.isHost &&
          room.players.length === 2 &&
          !room.inProgress
        ) {
          beginMatch(io, room, roomName);
        }
      }
    });

    socket.on("restart_game", (roomName: string) => {
      const room = activeMultiRooms.get(roomName);
      if (!room) return;

      const player = room.players.find((p) => p.id === socket.id);
      if (!player || room.inProgress || room.players.length !== 2) return;

      player.readyToRestart = true;
      io.to(roomName).emit("room_update", room.players);

      if (room.players.every((p) => p.readyToRestart)) {
        beginMatch(io, room, roomName);
      }
    });

    socket.on("leave_room", (roomNameToLeave: string) => {
      const roomToLeave = activeMultiRooms.get(roomNameToLeave);
      if (!roomToLeave) return;

      console.log(`user ${socket.id} left room ${roomNameToLeave}`);

      const leavingPlayer = roomToLeave.players.find((p) => p.id === socket.id);
      const wasHost = leavingPlayer?.isHost;
      const wasInProgress = roomToLeave.inProgress;

      roomToLeave.players = roomToLeave.players.filter(
        (p) => p.id !== socket.id,
      );

      socket.leave(roomNameToLeave);

      if (roomToLeave.players.length === 0) {
        activeMultiRooms.delete(roomNameToLeave);
      } else {
        if (wasHost && roomToLeave.players.length > 0) {
          roomToLeave.players[0].isHost = true;
        }
      }
      io.to(roomNameToLeave).emit("room_update", roomToLeave.players);

      if (wasInProgress) {
        endMultiGameIfOver(io, roomToLeave);
      }
    });
  });
}
