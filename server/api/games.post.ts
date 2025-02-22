import { useTurso } from "../utils";
import { z } from "zod";

const gameSchema = z.object({
  prompt: z.string(),
  name: z.string(),
});

export default defineEventHandler(async (event) => {
  console.log('posting game');
  const result = await readValidatedBody(event, body => gameSchema.safeParse(body));
  if (!result.success) {
    return {
      status: 400,
      data: {
        error: result.error,
      },
    };
  }

  const client = useTurso();

  // generate random 4 letter code
  async function generateCode() {
    const code = Math.random().toString(36).substring(2, 6);
    const check = await client.execute({
      sql: 'select * from Games where code = ?',
      args: [code],
    });
    if (check.rows.length > 0) {
      return generateCode();
    }
    return code;
  }
  const code = await generateCode();

  const { prompt, name } = result.data;

  const sql = `
    insert into Games 
    (code, prompt, creator, entries_done, ratings_done)
    values (?, ?, ?, 0, 0)`;
  const args = [code, prompt, name];

  await client.execute({ sql, args });

  const playerSql = `
    insert into Players
    (game_code, name)
    values (?, ?)`;
  const playerArgs = [code, name];
  await client.execute({ sql: playerSql, args: playerArgs });

  return {
    ok: true,
    code,
    name,
  };
});