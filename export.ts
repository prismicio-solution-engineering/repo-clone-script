import { config } from "dotenv";
import fetch from "node-fetch";
import "dotenv/config";
import path from "path";

import {
  createClient
} from "@prismicio/client";
import { clearDataFolder, saveDocumentsInBatches} from "./helpers/fileHelpers";
import { listAssets, saveAssetList } from "./helpers/assetsHelpers";
import { getAuthToken } from "./helpers/authHelpers";

config();

const instanceRepository = process.env.NEW_REPOSITORY_DOMAIN;
const templateRepository = process.env.TEMPLATE_DOMAIN;
const apiKey = process.env.MIGRATION_API_BETA_KEY;
const email = process.env.EMAIL;
const password = process.env.PASSWORD;
// Construct the Prismic Write request URLs

async function exportRepo() {
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
      `Initializing content in the repository ${instanceRepository} based on the template ${templateRepository}`
    );

    // Fetch the published documents from the template repository
    const client = createClient(templateRepository, { fetch });

    log(
      "Retrieving existing documents from the template for the master language"
    );
    const docs = await client.dangerouslyGetAll();
    
    const dataFolder = path.join(process.cwd(),'data')
    clearDataFolder(dataFolder)
    const docFolder = path.join(dataFolder,'prismic-documents')
    saveDocumentsInBatches(docs , docFolder)

    // Get Auth token
    log("Generating a user token to use Prismic's APIs");
    const token = await getAuthToken(email,password);

    const assetList = await listAssets(templateRepository,token)
    log(assetList.total + " assets in remote repository")
    saveAssetList(assetList)

  } catch (err) {
    // Might be errors with initial prismic images, can be ignored as they happen at the last step
    console.error("An error occurred:", err);
  }
}

exportRepo();

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