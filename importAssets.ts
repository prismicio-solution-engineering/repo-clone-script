import { config } from "dotenv";
import "dotenv/config";

import { processAssets, readAssetList } from "./helpers/assetsHelpers";
import { getAuthToken } from "./helpers/authHelpers";

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
    // log(
    //   `Uploading assets in the repository ${instanceRepository} based on the template ${templateRepository}`
    // );

    // Get Auth token
    log("Generating a user token to use Prismic's APIs");
    const token = await getAuthToken(email,password);

    // Download then upload to new repo all assets, and save asset Comparison table
    const assetList = readAssetList()
    processAssets(assetList,token,apiKey,instanceRepository)
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