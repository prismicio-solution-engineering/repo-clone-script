import { config } from "dotenv";
import "dotenv/config";
import { mutateDocs } from "./helpers/assetsHelpers";
import { updateDocsWithLinks } from "./helpers/docHelpers";

config();

const instanceRepository = process.env.NEW_REPOSITORY_DOMAIN;
const templateRepository = process.env.TEMPLATE_DOMAIN;
const apiKey = process.env.MIGRATION_API_BETA_KEY;
const email = process.env.EMAIL;
const password = process.env.PASSWORD;
// Construct the Prismic Write request URLs

async function init() {
  if (
    !templateRepository ||
    !instanceRepository ||
    !apiKey ||
    !email ||
    !password
  )
    throw new Error("Undefined configuration, please configure your .env file");
  try {
    log(
      `Generating docs with new Assets Ids in /data/new-asset-prismic-documents`
    );
    
    // Create docs with new Asset Ids
    updateDocsWithLinks();

  } catch (err) {
    console.error("An error occurred:", err);
  }
}

init();

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