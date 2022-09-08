import { Handler } from "@netlify/functions";
import { base } from "../config/airtable";

export const handler: Handler = async (
  event
): Promise<{ statusCode: 204 | 500; body?: string }> => {
  try {
    const cookie: string = JSON.parse(event.body as string);

    const records = await base("Auth")
      .select({
        maxRecords: 1,
        filterByFormula: `{browserUUID} = '${cookie}'`,
      })
      .firstPage();

    const id = records[0].id as string;

    await base("Auth").destroy([id]);

    return {
      statusCode: 204,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify(err),
    };
  }
};
