import { z } from "zod"
import { useTurso } from "../utils";

export default defineEventHandler(async (event) => {
  const result = await getValidatedQuery(event, query => z.object({ gameCode: z.string(), playerId: z.string() }).safeParse(query));
  if (!result.success) {
    return {
      status: 400,
      data: {
        error: result.error,
      },
    };
  }

  const { gameCode, playerId } = result.data;

  const client = useTurso();
  const { rows } = await client.execute({
    sql: 'select * from swaps where game_code = ? and to_player_id = ?',
    args: [gameCode, playerId],
  });

  if (rows.length === 0) {
    return {
      status: 404,
      data: {
        error: 'Swap not found',
      },
    };
  }
  const swap = rows[0];
  const { rows: fromPlayerRows } = await client.execute({
    sql: 'select * from entries where game_code = ? and player_id = ?',
    args: [gameCode, swap.from_player_id],
  });
  const fromEntry = fromPlayerRows[0];
  const swapToReturn = {
    ...swap,
    ...fromEntry,
  };

  return {
    ok: true,
    swap: swapToReturn,
  };
});