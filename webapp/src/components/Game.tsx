/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Game.tsx                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: morgane <morgane@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/03/05 18:37:31 by morgane           #+#    #+#             */
/*   Updated: 2026/03/05 19:50:08 by morgane          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useState } from "react";
import { Grid } from "../game/grid";
import { Pieces } from "../game/pieces";

export default function Game() {
const [grid, setGrid] = useState(new Grid());
const [piece, setPiece] = useState(new Pieces());



return (
  <div>
    {grid.getGrid().map((row, y) => (
      <div key={y} style={{ display: "flex" }}>
        {row.map((cell, x) => (
          <div
            key={x}
            style={{
              width: "30px",
              height: "30px",
              border: "1px solid white",
              backgroundColor: "black",
              display: "inline-block",
            }}
          />
        ))}
      </div>
    ))}
  </div>
)
};