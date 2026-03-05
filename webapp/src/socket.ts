/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   socket.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: morgane <morgane@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/03/05 15:57:11 by morgane           #+#    #+#             */
/*   Updated: 2026/03/05 15:59:31 by morgane          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { io } from "socket.io-client";

const socket = io(`http://localhost:${import.meta.env.VITE_BACKEND_PORT}`);

export default socket;