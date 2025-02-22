import { useTurso } from "../utils";
import { z } from "zod";

const makeEntrySchema = z.object({
  playerId: z.number(),
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

  return {
    ok: true,
    entry: sqlResult.rows[0],
  };
});

