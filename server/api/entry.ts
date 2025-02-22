import { z } from "zod"
import { useTurso } from "../utils";

export default defineEventHandler(async (event) => {
  const result = await getValidatedQuery(event,
    query =>
      z.object({
        code: z.string(),
        playerid: z.string()
      }).safeParse(query)
  );
  if (!result.success) {
    return {
      status: 400,
      data: {
        error: result.error,
      },
    };
  }

  const { code, playerid } = result.data;

  const client = useTurso();
  const { rows } = await client.execute({
    sql: 'select * from Entries where game_code = ? and player_id = ?',
    args: [code, playerid],
  });

  if (rows.length === 0) {
    return {
      status: 404,
      message: 'Entry not found',
    };
  }

  return {
    ok: true,
    entry: rows[0],
  };
});