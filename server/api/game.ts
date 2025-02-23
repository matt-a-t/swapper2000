import { z } from "zod"
import { useTurso } from "../utils";

export default defineEventHandler(async (event) => {
  const result = await getValidatedQuery(event, query => z.object({ code: z.string() }).safeParse(query));
  if (!result.success) {
    return {
      status: 400,
      data: {
        error: result.error,
      },
    };
  }

  const { code } = result.data;

  const client = useTurso();
  const { rows } = await client.execute({
    sql: 'select * from Games where code = ?',
    args: [code],
  });

  if (rows.length === 0) {
    return {
      status: 404,
      data: {
        error: 'Game not found',
      },
    };
  }
  const game = rows[0];

  const playersQuery = await client.execute({
    sql: 'select * from Players where game_code = ?',
    args: [game.code],
  });

  return {
    ok: true,
    game: {
      ...game,
      players: playersQuery.rows,
    },
  };
});