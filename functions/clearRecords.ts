import { Handler } from "@netlify/functions";
import { base } from "../config/airtable";

export const handler: Handler = async (
  event
): Promise<{ statusCode: 204 | 202 | 500; body?: string }> => {
  try {
    const ids: string[] = event.body ? JSON.parse(event.body) : {};

    if (!ids.length) {
      return {
        statusCode: 204,
      };
    }

    const filesToBeDeleted: { id: string; fields: { status: "deleted" } }[] =
      ids.map((id) => ({
        id,
        fields: {
          status: "deleted",
        },
      }));

    await base("Tasks").update(filesToBeDeleted);

    return {
      statusCode: 202,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify(err),
    };
  }
};
