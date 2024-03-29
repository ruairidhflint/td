import { Handler } from "@netlify/functions";
import { v4 } from "uuid";
import { compare } from "bcrypt";
import { base } from "../config/airtable";

export const handler: Handler = async (
  event
): Promise<{
  statusCode: 200 | 401 | 500;
  body: string;
}> => {
  try {
    const submittedPassword = JSON.parse(event.body as string);
    const records = await base("Password")
      .select({
        maxRecords: 1,
      })
      .firstPage();

    const password = records[0].fields.Password;
    const isValid = await compare(submittedPassword, password);

    if (isValid) {
      const browserUUID = v4();
      await base("Auth").create({
        browserUUID,
      });
      return {
        statusCode: 200,
        body: JSON.stringify(browserUUID),
      };
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify("Invalid credentials"),
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify(err),
    };
  }
};
