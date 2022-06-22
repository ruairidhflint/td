import { Handler } from "@netlify/functions";
import { base } from "../config/airtable";

export const handler: Handler = async () => {
  try {
    const records = await base("Table 1")
      .select({
        filterByFormula: "NOT({status} = 'deleted')",
        sort: [{ field: "created_at", direction: "desc" }],
      })
      .firstPage();

    const sanitizeRecords = records.map((record) => ({
      id: record.id,
      completed: record.fields.completed === "true" ? true : false,
      todo: record.fields.todo,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(sanitizeRecords),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify(err),
    };
  }
};
