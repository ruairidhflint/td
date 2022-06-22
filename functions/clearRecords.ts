import { Handler } from "@netlify/functions";
import { base } from "../config/airtable";

export const handler: Handler = async (event) => {
  try {
    const ids: string[] = event.body ? JSON.parse(event.body) : {};
    const filesToBeDeleted = ids.map((id) => ({
      id,
      fields: {
        status: "deleted",
      },
    }));

    await base("Table 1").update(filesToBeDeleted);

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
