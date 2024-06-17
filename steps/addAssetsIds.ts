import { config } from "dotenv";
import "dotenv/config";
import { mutateDocs } from "../helpers/assetsHelpers";
import { log } from "../ui/cli";

config();

// Read env
const instanceRepository = process.env.NEW_REPOSITORY_DOMAIN;
const templateRepository = process.env.TEMPLATE_DOMAIN;
const apiKey = process.env.MIGRATION_API_BETA_KEY;
const email = process.env.EMAIL;
const password = process.env.PASSWORD;

export async function addAssetsIds() {
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
    mutateDocs();
    return true

  } catch (err) {
    console.error("An error occurred:", err);
    return false
  }
}