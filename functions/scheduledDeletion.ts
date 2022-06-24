const { schedule, Handler } = require("@netlify/functions");
import { base } from "../config/airtable";

const handler = async (): Promise<{
  statusCode: 200 | 500;
  body?: string;
}> => {
  try {
    const records = await base("Table 1")
      .select({
        filterByFormula: "NOT({status} = 'active')",
        sort: [{ field: "created_at", direction: "desc" }],
      })
      .firstPage();

    const ids = records.map((record) => record.id);

    for (const id of ids) {
      await base("Table 1").destroy(id);
    }

    return {
      statusCode: 200,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify(err),
    };
  }
};

module.exports.handler = schedule("@daily", handler);
