import { z } from "zod"
import { useTurso } from "../utils";

const joinGameSchema = z.object({
  code: z.string(),
  name: z.string(),
});

export default defineEventHandler(async (event) => {
  const result = await readValidatedBody(event, body => joinGameSchema.safeParse(body));
  if (!result.success) {
    return {
      status: 400,
      data: {
        error: result.error,
      },
    };
  }

  const { code, name } = result.data;

  const client = useTurso();
  const gameQuery = await client.execute({
    sql: 'select * from Games where code = ?',
    args: [code],
  });

  if (gameQuery.rows.length === 0) {
    return {
      status: 404,
      data: {
        error: 'Game not found',
      },
    };
  }

  const gamePlayerResults = await client.execute({
    sql: 'select * from Players where game_code = ?',
    args: [code],
  });
  const gamePlayers = gamePlayerResults.rows;

  if (gamePlayers.find(player => player.name === name)) {
    throw createError({
      status: 409,
      data: {
        player: gamePlayers.find(player => player.name === name),
        message: 'Name already taken',
      },
    });
  }

  const player = await client.execute({
    sql: 'insert into Players (game_code, name) values (?, ?) returning *',
    args: [code, name],
  });

  return {
    ok: true,
    player: player.rows[0],
  };
});