import { useTurso } from "../utils";
import { z } from "zod";

const gameSchema = z.object({
  name: z.string(),
  prompt: z.string(),
  type: z.string(),
});

export default defineEventHandler(async (event) => {
  console.log('here');
  const result = await readValidatedBody(event, body => gameSchema.safeParse(body));
  if (!result.success) {
    // console.log('here2');
    // return {
    //   status: 400,
    //   data: {
    //     error: result.error,
    //   },
    // };
    throw new Error('Invalid body');
  }

  const { name, prompt, type } = result.data;
  console.log(name, prompt, type);
  // const client = useTurso(event);
  // const { rows } = await client.execute("select * from table_name");

  return {
    data: {
      items: [],
    },
  };
});