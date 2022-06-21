import { Handler } from "@netlify/functions";
import { base } from "../config/airtable";

export const handler: Handler = async (event) => {
  const body: { id: string; completed: string } = event.body
    ? JSON.parse(event.body)
    : {};

  await base("Table 1").update([
    {
      id: body.id,
      fields: {
        completed: body.completed,
      },
    },
  ]);

  return {
    statusCode: 204,
  };
};
