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

// By leaving the URL empty, Socket.IO automatically connects to the current domain 
// (http://localhost:80). Traefik intercepts the /socket.io/ path and sends it 
// straight to your Express container!
const socket = io({
  path: '/socket.io/',
  autoConnect: true
});

export default socket;