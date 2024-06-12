import { config } from "dotenv";
import "dotenv/config";

import { getAuthToken } from "./helpers/authHelpers";
import { createDocs } from "./helpers/docHelpers";

config();

const instanceRepository = process.env.NEW_REPOSITORY_DOMAIN;
const templateRepository = process.env.TEMPLATE_DOMAIN;
const apiKey = process.env.MIGRATION_API_BETA_KEY;
const email = process.env.EMAIL;
const password = process.env.PASSWORD;

const batchNumber = process.argv[2]

async function importDocs() {
  if (
    !templateRepository ||
    !instanceRepository ||
    !apiKey ||
    !email ||
    !password
  )
    throw new Error("Undefined configuration, please configure your .env file, and specify batch number as param");
  try {
    function isPositiveInteger(value: string) {
      const number = Number(value);
      return Number.isInteger(number) && number > 0;
    }

    if (batchNumber && isPositiveInteger(batchNumber)) {
      log(
        `Uploading docs (with new Assets, but old Links) in the repository ${instanceRepository} based on the template ${templateRepository}`
      );

      // Get Auth token
      log("Generating a user token to use Prismic's APIs");
      const token = await getAuthToken(email, password);

      // Push docs with new Asset Ids and build docComparisonTable
      createDocs(Number(batchNumber), token);
    } else {
      console.error(`${batchNumber} is not a positive integer. Please input a positive integer`);
    }

  } catch (err) {
    console.error("An error occurred:", err);
  }
}

importDocs();

// Simple logger function
export function log(message: string, nesting: number = 0): void {
  if (nesting === 0) console.log("[Init Content]: ", message);
  else {
    let padding = "";
    for (let i = 0; i < nesting; i++) {
      padding = padding + "\t";
    }
    console.log(padding, `- ${message}`);
  }
}