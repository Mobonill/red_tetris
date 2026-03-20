/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   index.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: morgane <morgane@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/03/05 13:37:14 by morgane           #+#    #+#             */
/*   Updated: 2026/03/20 12:09:33 by morgane          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import Express from "express";
import http from "http";
import { Server } from "socket.io";
import { PORT } from "./config/env.js";
import { Pieces } from "./classes/pieces.js";
import { Grid } from "./classes/grid.js";
import { clearInterval } from "timers";

const app = Express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("user connected: ", socket.id);
  const grid = new Grid();
  let piece = new Pieces();
  let gameOver = false;
  let isLocked = false;

  const emitState = () => {
    socket.emit("state", {
      grid: grid.getGrid(),
      shape: piece.getCurrentShape(),
      position: piece.getPosition(),
      color: piece.getColor(),
    });
  };

  const timer = setInterval(() => {
    if (gameOver) {
      socket.emit("game_over");
      clearInterval(timer);
      return;
    }
    piece.moveDown();
    if (!grid.isPiecePositionValid(piece)) {
      piece.moveUp();
      if (isLocked) return;
      isLocked = true;
      grid.lockPiece(piece);
      grid.clearLines();
      piece = new Pieces();
      if (!grid.isPiecePositionValid(piece)) {
        gameOver = true;
        isLocked = false;
        return;
      }
      isLocked = false;
    }
    emitState();
  }, 1200);

  socket.on("move", (direction: string) => {
    console.log("mouvement reçu:", direction); // "ArrowLeft"

    switch (direction) {
      case "ArrowLeft":
        piece.moveLeft();
        if (!grid.isPiecePositionValid(piece)) piece.moveRight();
        emitState();
        break;

      case "ArrowRight":
        piece.moveRight();
        if (!grid.isPiecePositionValid(piece)) piece.moveLeft();
        emitState();
        break;

      case "ArrowDown":
        piece.moveDown();
        if (!grid.isPiecePositionValid(piece)) piece.moveUp();
        emitState();
        break;

      case "ArrowUp":
        piece.rotate();
        if (!grid.isPiecePositionValid(piece)) {
          piece.moveLeft();
          if (!grid.isPiecePositionValid(piece)) {
            piece.moveRight();
            piece.moveRight();
            if (!grid.isPiecePositionValid(piece)) {
              piece.moveLeft();
              piece.unrotate();
            }
          }
        }
        emitState();
        break;

      case " ": {
        if (isLocked || gameOver) return;
        isLocked = true;
        while (grid.isPiecePositionValid(piece)) {
          piece.moveDown();
        }
        piece.moveUp();
        grid.lockPiece(piece);
        grid.clearLines();
        const nextPiece = new Pieces();
        if (!grid.isPiecePositionValid(nextPiece)) {
          socket.emit("game_over");
          clearInterval(timer);
        }
        piece = nextPiece;
        isLocked = false;
        emitState();
        return;
      }
    }
  });

  socket.on("disconnect", () => {
    clearInterval(timer);
    console.log("user disconnected: ", socket.id);
  });
});

app.get("/api", (req, res) => {
  res.send("Server created and routed through Traefik!");
  res.sendFile(__dirname + "../../webapp/index.html");
});

server.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`Server launched on port ${PORT}`);
});
