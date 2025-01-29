import { useTurso } from "../utils";
import { z } from "zod";

const makeEntrySchema = z.object({
  playerId: z.string(),
  gameCode: z.string(),
  albumName: z.string(),
  artistName: z.string(),
  songName: z.string(),
  link: z.string(),
  comment: z.string(),
});

export default defineEventHandler(async (event) => {
  console.log('posting swap entry');
  const result = await readValidatedBody(event, body => makeEntrySchema.safeParse(body));
  if (!result.success) {
    return {
      status: 400,
      data: {
        error: result.error,
      },
    };
  }

  const client = useTurso();

  const check = await client.execute({
    sql: 'select * from Entries where game_code = ? and player_id = ?',
    args: [result.data.gameCode, result.data.playerId],
  });

  if (check.rows.length > 0) {
    return {
      status: 409,
      data: {
        error: 'Player already entered',
      },
    };
  }

  const { playerId, gameCode, albumName, artistName, songName, link, comment } = result.data;
  const sql = `insert into Entries 
    (player_id, game_code, album_name, artist_name, song_name, link, comment) 
    values (?, ?, ?, ?, ?, ?, ?)
    returning *`;
  const args = [playerId, gameCode, albumName, artistName, songName, link, comment];

  const sqlResult = await client.execute({ sql, args });

  // now check if all players have entered
  const game = await client.execute({
    sql: 'select * from Games where code = ?',
    args: [gameCode],
  });

  const players = await client.execute({
    sql: 'select * from Players where game_code = ?',
    args: [gameCode],
  });

  const entries = await client.execute({
    sql: 'select * from Entries where game_code = ?',
    args: [gameCode],
  });

  if (players.rows.length === entries.rows.length) {
    await client.execute({
      sql: 'update Games set finished = 1 where code = ?',
      args: [gameCode],
    });
  }

  // randomly assign swaps to players
  const shuffled = players.rows.sort(() => Math.random() - 0.5);
  const swaps = shuffled.map((player, i) => {
    return {
      from: player.id,
      to: shuffled[(i + 1) % shuffled.length].id,
    };
  });
  for (const swap of swaps) {
    await client.execute({
      sql: 'insert into Swaps (game_code, from_player, to_player) values (?, ?, ?)',
      args: [gameCode, swap.from, swap.to],
    });
  }

  return {
    ok: true,
    entry: sqlResult.rows[0],
  };
});

