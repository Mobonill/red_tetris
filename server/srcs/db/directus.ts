/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   directus.ts                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mobonill <mobonill@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/11/10 16:31:03 by mobonill          #+#    #+#             */
/*   Updated: 2026/11/10 18:26:55 by mobonill         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { createDirectus, rest, staticToken, createItem, readItems } from '@directus/sdk';

export type Score = {
  id?: number;
  player_name: string;
  score: number;
  lines: number;
  date_created?: string;
};

type Schema = { scores: Score[] };

const directus = createDirectus<Schema>(process.env.DIRECTUS_URL ?? 'http://localhost:8055')
  .with(staticToken(process.env.DIRECTUS_TOKEN ?? ''))
  .with(rest());

export const saveScore = async (s: Score): Promise<void> => {
  try {
    await directus.request(createItem('scores', s));
  } catch (err) {
    console.error('[directus] saveScore failed:', err);
  }
};

export const getLeaderboard = (limit = 10) =>
  directus.request(readItems('scores', { sort: ['-score'], limit }));