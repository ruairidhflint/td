import { Handler } from "@netlify/functions";
import { base } from "../config/airtable";

export const handler: Handler = async (event) => {
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
};
