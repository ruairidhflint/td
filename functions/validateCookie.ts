import { Handler } from "@netlify/functions";
import { base } from "../config/airtable";

export const handler: Handler = async (
  event
): Promise<{
  statusCode: 200 | 401 | 500;
  body?: string;
}> => {
  try {
    const cookie = JSON.parse(event.body as string);
    const records = await base("Auth")
      .select({
        maxRecords: 1,
        filterByFormula: `{browserUUID} = '${cookie}'`,
      })
      .firstPage();

    if (!records.length) {
      return {
        statusCode: 401,
        body: JSON.stringify("Invalid token"),
      };
    } else {
      return {
        statusCode: 200,
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify(err),
    };
  }
};
