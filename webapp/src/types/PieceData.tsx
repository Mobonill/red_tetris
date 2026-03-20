/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   PieceData.tsx                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: morgane <morgane@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/03/20 11:36:34 by morgane           #+#    #+#             */
/*   Updated: 2026/03/20 11:37:47 by morgane          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import type { Grid2D, Position } from "../../../server/srcs/classes/types";


export type PieceData = {
  shape: Grid2D;
  position: Position;
  color: string;
};