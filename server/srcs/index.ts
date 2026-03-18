/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   index.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: morgane <morgane@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/03/05 13:37:14 by morgane           #+#    #+#             */
/*   Updated: 2026/03/05 15:41:34 by morgane          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import Express from "express";
import http from "http";
import { Server } from "socket.io";
import { PORT } from "./config/env.js";

const app = Express();
const server = http.createServer(app);

// Socket.io setup (CORS might be needed later, but this is fine for now)
const io = new Server(server);

// 👇 Changed from "/" to "/api" so it matches Traefik
app.get("/api", (req, res) => {
  res.send("Server created and routed through Traefik!");
});

// 👇 Added "0.0.0.0" to ensure Docker exposes it correctly
server.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`Server launched on port ${PORT}`);
});
