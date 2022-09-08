import { Handler } from "@netlify/functions";
import { base } from "../config/airtable";
import { Todo } from "../types";

export const handler: Handler = async (
  event
): Promise<{ statusCode: 200 | 500; body?: string }> => {
  try {
    const todo: string =
      event.body && JSON.parse(event.body).todo
        ? JSON.parse(event.body).todo
        : "";

    const newRecord = await base("Tasks").create({
      todo,
      completed: "false",
      status: "active",
      created_at: new Date().toISOString(),
    });

    const sanitizedRecord: Todo = {
      id: newRecord.id,
      completed: false,
      todo:
        newRecord.fields &&
        newRecord.fields.todo &&
        typeof newRecord.fields.todo === "string"
          ? newRecord.fields.todo
          : "",
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
