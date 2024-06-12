import { config } from "dotenv";
import fetch from "node-fetch";
import "dotenv/config";
import path from "path";
import fs from "fs-extra";

import {
  createClient,
  AnyRegularField,
  GroupField,
  isFilled,
  RTNode,
  FilledLinkToMediaField,
} from "@prismicio/client";
import type { PrismicDocument, SliceZone } from "@prismicio/client";
import { readAllDocuments, saveAssetComparisonTable, saveDocumentsInBatches } from "./helpers/fileHelpers";
import { listAssets, mutateDocs, processAssets, saveAssetList } from "./helpers/assetsHelpers";
import { getAuthToken } from "./helpers/authHelpers";
import { updateDocs } from "./helpers/docHelpers";

config();

const instanceRepository = process.env.NEW_REPOSITORY_DOMAIN;
const templateRepository = process.env.TEMPLATE_DOMAIN;
const apiKey = process.env.MIGRATION_API_BETA_KEY;
const email = process.env.EMAIL;
const password = process.env.PASSWORD;
// Construct the Prismic Write request URLs
const migrationUrl = `https://migration.prismic.io/documents`;
const assetUrl = `https://asset-api.prismic.io/assets`;

const batchNumber = process.argv[2]

async function reImportDocs() {
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

      // // Get Auth token
      log("Generating a user token to use Prismic's APIs");
      const token = await getAuthToken(email, password);

      updateDocs(Number(batchNumber), token)
    } else {
      console.error(`${batchNumber} is not a positive integer. Please input a positive integer`);
    }
  } catch (err) {
    console.error("An error occurred:", err);
  }
}

reImportDocs();

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

// Upload assets and update asset comparison table with new assetID
// const uploadAssets = async (
//   assetComparisonTable: {
//     olDid: string;
//     url: string;
//     fileName: string;
//     newId: string;
//   }[],
//   token: string
// ) => {
//   const folderPath = path.join(process.cwd(), "/assets");

//   try {
//     for (let i = 0; i < assetComparisonTable.length; i++) {
//       const filePath = path.join(folderPath, assetComparisonTable[i].fileName);
//       const uploadResponse = await uploadFile(filePath, token);
//       assetComparisonTable[i].newId = uploadResponse.data.id;
//       log(`Uploaded Asset located at: ${filePath}`, 1);
//     }
//   } catch (err) {
//     console.error("Error processing files:", err);
//   }
// };

// // Upload Asset File query (wait for 2s)
// const uploadFile = async (filePath: fs.PathLike, token: string) => {
//   const formData = new FormData();
//   formData.append("file", fs.createReadStream(filePath));

//   const response = await fetch(assetUrl, {
//     method: "POST",
//     body: formData,
//     headers: {
//       ...formData.getHeaders(),
//       Authorization: `Bearer ${token}`,
//       "x-api-key": apiKey!,
//       repository: instanceRepository,
//       Accept: "application/json",
//       "User-Agent": "prismic-clone-script",
//     },
//   });

//   if (!response.ok) {
//     throw new Error(`Failed to upload file: ${response.statusText}`);
//   }

//   await delay(1000);

//   const json = await response.json();
//   return {
//     status: response.status,
//     statusText: response.statusText,
//     headers: response.headers.raw(),
//     data: json as { id: string },
//   };
// };

const delay = (ms: number | undefined) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// //Replace assetIDs in all docs
// const mutateDocs = (
//   docs: PrismicDocument[],
//   assetComparisonTable: {
//     olDid: string;
//     url: string;
//     fileName: string;
//     newId: string;
//   }[]
// ) => {
//   const mutatedDocs: (PrismicDocument & { title: string })[] = [];

//   docs.forEach((document) => {
//     const mutatedDoc: PrismicDocument & { title: string } = {
//       ...document,
//       title: "Title",
//     };
//     if (document && document.data) {
//       // Extract from direct data properties
//       mutatedDoc.data = editIdFromImage(document.data, assetComparisonTable);

//       // Extract from slices if available
//       if ("slices" in document.data && document.data.slices) {
//         for (let i = 0; i < document.data.slices.length; i++) {
//           // Extract from primary object
//           if (document.data.slices[i].primary) {
//             mutatedDoc.data.slices[i].primary = editIdFromImage(
//               document.data.slices[i].primary,
//               assetComparisonTable
//             );
//           }
//           // Extract from each item in items array
//           if (
//             document.data.slices[i].items &&
//             document.data.slices[i].items.length > 0
//           ) {
//             for (let j = 0; j < document.data.slices[i].items.length; j++) {
//               mutatedDoc.data.slices[i].items[j] = editIdFromImage(
//                 document.data.slices[i].items[j],
//                 assetComparisonTable
//               );
//             }
//           }
//         }
//       }
//       //add a title to doc
//       mutatedDoc.title = document.uid ?? document.type;
//     }
//     mutatedDocs.push(mutatedDoc);
//   });
//   return mutatedDocs;
// };

//Replace old AssetId with new AssetId in image field
function editIdFromImage(
  record: Record<string, AnyRegularField | GroupField | SliceZone>,
  assetComparisonTable: {
    olDid: string;
    url: string;
    fileName: string;
    newId: string;
  }[]
) {
  for (const fieldName in record) {
    const field = record[fieldName];
    //Check if field is an Image
    if (
      field &&
      typeof field === "object" &&
      "alt" in field &&
      !("embed_url" in field) &&
      isFilled.image(field)
    ) {
      field.id = assetComparisonTable.find(
        (asset) => asset.olDid === field.id
      )!.newId;
      field.url = "";
      record[fieldName] = field;
    }
    //Check if field is a link to Media
    if (
      field &&
      typeof field === "object" &&
      "link_type" in field &&
      field.link_type === "Media"
    ) {
      const mediaField = field as FilledLinkToMediaField;
      if (mediaField.id !== undefined) {
        mediaField.id = assetComparisonTable.find(
          (asset) => asset.olDid === mediaField.id
        )!.newId;
        mediaField.url = "";
        record[fieldName] = field;
      }
    }
    //Check if field a RichText or a Group containing an image
    if (field && Array.isArray(field)) {
      for (let i = 0; i < field.length; i++) {
        const fieldItem = field[i];
        // Check if field is a RichText containing an image
        if (
          "type" in fieldItem &&
          fieldItem.type === "image" &&
          fieldItem.url !== undefined &&
          fieldItem.id !== undefined
        ) {
          fieldItem.id = assetComparisonTable.find(
            (asset) => asset.olDid === fieldItem.id
          )!.newId;
        }
        // Check if field is a Group containing an image
        if (!("slice_type" in fieldItem) && !("type" in fieldItem)) {
          for (const subFieldName in fieldItem) {
            const subField = fieldItem[subFieldName];
            // Check if field is a Group containing directly an image
            if (
              subField &&
              typeof subField === "object" &&
              !("type" in subField) &&
              "alt" in subField &&
              !("embed_url" in subField) &&
              isFilled.image(subField)
            ) {
              subField.id = assetComparisonTable.find(
                (asset) => asset.olDid === subField.id
              )!.newId;
              subField.url = "";
              fieldItem[subFieldName] = subField;
            }
            //Check if field is a Group containing link to Media
            if (
              subField &&
              typeof subField === "object" &&
              "link_type" in subField &&
              subField.link_type === "Media"
            ) {
              const mediaSubField = subField as FilledLinkToMediaField;
              if (mediaSubField.id !== undefined) {
                mediaSubField.id = assetComparisonTable.find(
                  (asset) => asset.olDid === mediaSubField.id
                )!.newId;
                mediaSubField.url = "";
                fieldItem[subFieldName] = mediaSubField;
              }
            }
            // Check if field is a Group containing a RichText containing an image
            if (Array.isArray(subField)) {
              for (let j = 0; j < subField.length; j++) {
                const richTextItem = subField[j] as RTNode;
                // Check if field is a RichText containing an image
                if (
                  "type" in richTextItem &&
                  richTextItem.type === "image" &&
                  richTextItem.url !== undefined &&
                  richTextItem.id !== undefined
                ) {
                  richTextItem.id = assetComparisonTable.find(
                    (asset) => asset.olDid === richTextItem.id
                  )!.newId;
                  subField[j] = richTextItem;
                }
              }
              fieldItem[subFieldName] = subField;
            }
          }
        }
        // store changes
        field[i] = fieldItem;
      }
      //store changes
      record[fieldName] = field;
    }
  }
  return record;
}

// Push updated docs to target repository
const pushUpdatedDocs = async (
  docsWithNewAssetIds: (PrismicDocument & { title: string })[],
  token: string
) => {
  const docComparisonTable = docsWithNewAssetIds.map((doc) => ({
    olDid: doc.id,
    newId: "",
  }));

  for (let i = 0; i < docsWithNewAssetIds.length; i++) {
    const doc = docsWithNewAssetIds[i];

    // Send the update
    try {
      const response = await fetch(migrationUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-api-key": apiKey!,
          "Content-Type": "application/json",
          repository: instanceRepository!,
          "User-Agent": "prismic-clone-script",
        },
        method: "POST",
        body: JSON.stringify(doc),
      });
      if (response.ok) {
        log(
          "New document imported of type : " +
          doc.type +
          " and uid: " +
          doc.uid,
          1
        );
        const newDoc = (await response.json()) as {
          id: string;
          type: string;
          lang: string;
          title: string;
        };
        docComparisonTable[i].newId = newDoc.id;
      } else {
        console.error(
          "Request failed for doc of type : " +
          doc.type +
          " and uid: " +
          doc.uid +
          " Error details : " +
          (await response.text())
        );
      }
      await delay(1000);
    } catch (err) {
      console.error("Error while uploading new document: ", err);
    }
  }
  return docComparisonTable;
};

//Replace assetIDs in all docs (need to add support for RichText links)
const mutateDocsWithLinks = (
  docs: (PrismicDocument & { title: string })[],
  docComparisonTable: {
    olDid: string;
    newId: string;
  }[]
) => {
  const mutatedDocs: (PrismicDocument & { title: string })[] = [];

  docs.forEach((document) => {
    const mutatedDoc: PrismicDocument & { title: string } = { ...document };
    if (document && document.data) {
      // Set New id
      // richtext example https://github.com/prismicio-solution-engineering/sm-migration-scripts/blob/master/migrate-links.mjs
      mutatedDoc.id = docComparisonTable.find(
        (doc) => doc.olDid === document.id
      )!.newId;

      // Extract from direct data properties
      mutatedDoc.data = editIdFromLink(document.data, docComparisonTable);

      // Extract from slices if available
      if (document.data.slices) {
        for (let i = 0; i < document.data.slices.length; i++) {
          // Extract from primary object
          if (document.data.slices[i].primary) {
            mutatedDoc.data.slices[i].primary = editIdFromLink(
              document.data.slices[i].primary,
              docComparisonTable
            );
          }
          // Extract from each item in items array
          if (
            document.data.slices[i].items &&
            document.data.slices[i].items.length > 0
          ) {
            for (let j = 0; j < document.data.slices[i].items.length; j++) {
              mutatedDoc.data.slices[i].items[j] = editIdFromLink(
                document.data.slices[i].items[j],
                docComparisonTable
              );
            }
          }
        }
      }
    }
    mutatedDocs.push(mutatedDoc);
  });
  return mutatedDocs;
};

//Replace old linkId with new linkId in link field
function editIdFromLink(
  record: Record<string, AnyRegularField | GroupField | SliceZone>,
  docComparisonTable: {
    olDid: string;
    newId: string;
  }[]
) {
  const findLinkId = (oldId: string): string => {
    const entry = docComparisonTable.find((doc) => doc.olDid === oldId);
    if (entry === undefined)
      throw new Error(`The new ID for the link ${oldId} couldn't be found`);
    return entry.newId;
  };

  for (const fieldName in record) {
    const field = record[fieldName];
    //Check if field is a Link
    if (
      field &&
      typeof field === "object" &&
      "id" in field &&
      typeof field.id === "string" &&
      "isBroken" in field &&
      field.isBroken === false
    ) {
      field.id = findLinkId(field.id);
      record[fieldName] = field;
    }
    //Check if field a RichText or a Group containing a Link
    if (field && Array.isArray(field)) {
      for (let i = 0; i < field.length; i++) {
        const fieldItem = field[i];
        // Check if field is a RichText containing a link
        if (
          "type" in fieldItem &&
          "spans" in fieldItem &&
          Array.isArray(fieldItem.spans) &&
          fieldItem.spans.length > 0
        ) {
          for (let j = 0; j < fieldItem.spans.length; j++) {
            const fieldItemSpan = fieldItem["spans"][j];
            if (
              fieldItemSpan.type === "hyperlink" &&
              "data" in fieldItemSpan &&
              fieldItemSpan.data.link_type === "Document" &&
              fieldItemSpan.data.isBroken === false
            ) {
              const fieldItemSpanlinkId = fieldItemSpan.data.id;
              fieldItemSpan.data.id = findLinkId(fieldItemSpanlinkId);
            }
            fieldItem["spans"][j] = fieldItemSpan;
          }
        }
        // Check if field is a Group containing an image
        if (!("slice_type" in fieldItem) && !("type" in fieldItem)) {
          for (const subFieldName in fieldItem) {
            const subField = fieldItem[subFieldName];
            // Check if field is a Group containing directly a link
            if (
              subField &&
              typeof subField === "object" &&
              "id" in subField &&
              typeof subField.id === "string" &&
              "isBroken" in subField &&
              subField.isBroken === false
            ) {
              subField.id = findLinkId(subField.id);
              fieldItem[subFieldName] = subField;
            }
            // Check if field is a Group containing a RichText containing a link
            if (Array.isArray(subField)) {
              for (let j = 0; j < subField.length; j++) {
                const richTextItem = subField[j] as RTNode;
                // Check if field is a RichText containing a link
                if (
                  "type" in richTextItem &&
                  "spans" in richTextItem &&
                  Array.isArray(richTextItem.spans) &&
                  richTextItem.spans.length > 0
                ) {
                  for (let k = 0; k < richTextItem.spans.length; k++) {
                    const fieldItemSpan = richTextItem["spans"][k];
                    if (
                      fieldItemSpan.type === "hyperlink" &&
                      "data" in fieldItemSpan &&
                      fieldItemSpan.data.link_type === "Document" &&
                      fieldItemSpan.data.isBroken === false
                    ) {
                      const fieldItemSpanlinkId = fieldItemSpan.data.id;
                      fieldItemSpan.data.id = findLinkId(fieldItemSpanlinkId);
                    }
                    richTextItem["spans"][k] = fieldItemSpan;
                  }
                }
                subField[j] = richTextItem;
              }
              fieldItem[subFieldName] = subField;
            }
          }
        }
        // store changes
        field[i] = fieldItem;
      }
      //store changes
      record[fieldName] = field;
    }
  }
  return record;
}

// Push updated docs to target repository
const pushUpdatedDocsWithLinks = async (
  docsWithNewLinks: (PrismicDocument & { title: string })[],
  token: string
) => {
  for (let i = 0; i < docsWithNewLinks.length; i++) {
    const doc = docsWithNewLinks[i];
    // Send the update
    const response = await fetch(migrationUrl + "/" + doc.id, {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-api-key": apiKey!,
        "Content-Type": "application/json",
        repository: instanceRepository!,
        "User-Agent": "prismic-clone-script",
      },
      method: "PUT",
      body: JSON.stringify(doc),
    });

    await delay(1000);
  }
};
