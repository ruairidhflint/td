import { Handler } from "@netlify/functions";
import { base } from "../config/airtable";

export const handler: Handler = async (event) => {
  try {
    const todo: string =
      event.body && JSON.parse(event.body).todo
        ? JSON.parse(event.body).todo
        : "";

    const newRecord = await base("Table 1").create({
      todo,
      completed: "false",
      status: "active",
      created_at: new Date().toISOString(),
    });

    const sanitizedRecord = {
      id: newRecord.id,
      completed: false,
      todo: newRecord.fields.todo,
    };

    return {
      statusCode: 200,
      body: JSON.stringify(sanitizedRecord),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify(err),
    };
  }
};
