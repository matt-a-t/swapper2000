import { useTurso } from "../utils";
import { z } from "zod";

const makeEntrySchema = z.object({
  gameCode: z.string(),
});

export default defineEventHandler(async (event) => {
  console.log('posting request for swap');
  const result = await readValidatedBody(event, body => makeEntrySchema.safeParse(body));
  if (!result.success) {
    return {
      status: 400,
      data: {
        error: result.error,
      },
    };
  }
  const { gameCode } = result.data;

  const client = useTurso();

  const entriesQuery = await client.execute({
    sql: 'select * from Entries where game_code = ?',
    args: [gameCode],
  });
  const entries = entriesQuery.rows;
  const allIds = entries.map(entry => entry.player_id) as number[];
  const usedIds = [] as number[];
  const results = [] as any[];

  for (const entry of entries) {
    const fromId = entry.player_id;
    const toId =
      allIds.find(id => !usedIds.includes(id) && id !== fromId) ||
      allIds.find(id => id !== fromId) ||
      0;

    usedIds.push(toId);


    const sql = `insert into Swaps 
    (from_player_id, to_player_id, game_code)
    values (?, ?, ?)
    returning *`;
    const args = [fromId, toId, gameCode];

    const sqlResult = await client.execute({ sql, args });
    results.push(sqlResult.rows[0]);
  }

  const sql = `update Games set entries_done = 1 where code = ?`;
  const args = [gameCode];
  await client.execute({ sql, args });

  return {
    ok: true,
    results
  };
});