import { z } from "zod"
import { useTurso } from "../utils";

// type Player = {
//   id: number;
//   game_code: string;
//   name: string;
// };

// type Game = {
//   code: string;
//   prompt: string;
//   creator: string;
//   entries_done: boolean;
//   ratings_done: boolean;
//   players: Player[];
// }

export default defineEventHandler(async (event) => {
  const result = await getValidatedQuery(event, query => z.object({ code: z.string() }).safeParse(query));
  if (!result.success) {
    console.error('error', result.error);
    throw createError({
      status: 400,
      data: {
        error: result.error,
      },
    });
  }

  const { code } = result.data;

  const client = useTurso();
  const { rows } = await client.execute({
    sql: 'select * from Games where code = ?',
    args: [code],
  });

  if (rows.length === 0) {
    throw createError({
      status: 404,
      data: {
        error: 'Game not found',
      },
    });
  }
  const game = rows[0];

  const playersQuery = await client.execute({
    sql: 'select * from Players where game_code = ?',
    args: [game.code],
  });

  const entriesQuery = await client.execute({
    sql: 'select * from Entries where game_code = ?',
    args: [game.code],
  });

  const swapsQuery = await client.execute({
    sql: 'select * from Swaps where game_code = ?',
    args: [game.code],
  });

  return {
    ok: true,
    game: {
      ...game,
      entries: entriesQuery.rows,
      players: playersQuery.rows,
      swaps: swapsQuery.rows,
    },
  };
});