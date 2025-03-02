import { useTurso } from "../utils";
import { z } from "zod";

const guessSchema = z.object({
  gameCode: z.string(),
  guessedId: z.number(),
  playerId: z.number(),
});

export default defineEventHandler(async (event) => {
  console.log('posting guess');
  const result = await readValidatedBody(event, body => guessSchema.safeParse(body));
  if (!result.success) {
    return createError({
      status: 400,
      data: {
        error: result.error,
      },
    })
  }

  const { gameCode, guessedId, playerId } = result.data;

  const client = useTurso();
  const sql = `
     update Swaps
     set player_guess_id = ?
      where game_code = ? and to_player_id = ?`;
  const args = [guessedId, gameCode, playerId];
  await client.execute({ sql, args });

  return {
    ok: true,
  };
});