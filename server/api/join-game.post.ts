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
  const check = await client.execute({
    sql: 'select * from Games where code = $1',
    args: [code],
  });

  if (check.rows.length === 0) {
    return {
      status: 404,
      data: {
        error: 'Game not found',
      },
    };
  }

  const gamePlayerResults = await client.execute({
    sql: 'select * from Players where game = $1',
    args: [code, name],
  });
  const gamePlayers = gamePlayerResults.rows;

  if (gamePlayers.find(player => player.name === name)) {
    return {
      status: 409,
      data: {
        error: 'Name already taken',
      },
    };
  }

  const firstBlankPlayer = gamePlayers.find(player => !player.name);
  if (firstBlankPlayer) {
    await client.execute({
      sql: 'update Players set name = $1 where id = $2',
      args: [name, firstBlankPlayer.id],
    });

    return {
      status: 200,
      data: {
        ok: true,
      },
    };
  } else {
    await client.execute({
      sql: 'insert into Players (game_code, name) values ($1, $2)',
      args: [code, name],
    });

    return {
      status: 200,
      data: {
        ok: true,
      },
    };
  }
});