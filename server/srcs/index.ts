/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   index.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: morgane <morgane@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/03/05 13:37:14 by morgane           #+#    #+#             */
/*   Updated: 2026/03/20 12:26:32 by morgane          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import Express from "express";
import http from "http";
import { PORT } from "./config/env.js";
import { Server } from "socket.io";
import { initSocket } from "./socket/socket.js";

const app = Express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

initSocket(io);

app.get("/api", (req, res) => {
  res.send("Server created and routed through Traefik!");
  res.sendFile(__dirname + "../../webapp/index.html");
});

server.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`Server launched on port ${PORT}`);
});
