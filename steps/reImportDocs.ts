import { config } from "dotenv";
import "dotenv/config";
import { getAuthToken } from "../helpers/authHelpers";
import { updateDocs } from "../helpers/docHelpers";
import { log } from "../ui/cli";

config();

// Get env
const instanceRepository = process.env.NEW_REPOSITORY_DOMAIN;
const templateRepository = process.env.TEMPLATE_DOMAIN;
const apiKey = process.env.MIGRATION_API_BETA_KEY;
const email = process.env.EMAIL;
const password = process.env.PASSWORD;

export async function reImportDocs(batchNumber:string) {
  if (
    !templateRepository ||
    !instanceRepository ||
    !apiKey ||
    !email ||
    !password
  )
    throw new Error("Undefined configuration, please configure your .env file");
  try {
    function isPositiveInteger(value: string) {
      const number = Number(value);
      return Number.isInteger(number) && number > 0;
    }

    if (batchNumber && isPositiveInteger(batchNumber)) {

      // Get Auth token
      log("Generating a user token to use Prismic's APIs");
      const token = await getAuthToken(email, password);

      await updateDocs(Number(batchNumber), token)
      return true
    } else {
      console.error(`${batchNumber} is not a positive integer. Please input a positive integer`);
      return false
    }
  } catch (err) {
    console.error("An error occurred:", err);
    return false
  }
}