/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   types.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: morgane <morgane@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/03/05 17:31:07 by morgane           #+#    #+#             */
/*   Updated: 2026/03/05 17:32:54 by morgane          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export type Cell = string | 0;

export type Grid2D = Cell[][];

export type Position = { x: number; y: number };

export type PieceType = "I" | "J" | "L" | "O" | "S" | "T" | "Z";
export const PIECE_TYPES: PieceType[] = ["I", "J", "L", "O", "S", "T", "Z"];
