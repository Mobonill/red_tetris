/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   index.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: morgane <morgane@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/03/05 13:37:14 by morgane           #+#    #+#             */
/*   Updated: 2026/03/05 15:08:41 by morgane          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import Express from "express";
import { PORT } from "./config/env.js";

const app = Express();

app.get("/", (req, res) => {
  res.send("Server created");
});

app.listen(PORT, () => {
  console.log(`Serveur lauch on http://localhost:${PORT}`);
});
