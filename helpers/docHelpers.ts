import fetch from 'node-fetch';
import fs from "fs-extra";
import path from 'path';
import { docBatchSize } from '../steps/constants';
import { PrismicDocument } from '@prismicio/client';
import { config } from 'dotenv';
import { replaceIdsInObject } from './assetsHelpers';
import { saveDocumentsInBatches } from './fileHelpers';
import { log } from '../ui/cli';

config();

const instanceRepository = process.env.NEW_REPOSITORY_DOMAIN;
const apiKey = process.env.MIGRATION_API_BETA_KEY;

const migrationUrl = `https://migration.prismic.io/documents`;

// Delay function
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function updateDocComparisonTable(
  docComparisonTable: {
    olDid: string;
    newId: string;
  }[],
  currentTable: {
    olDid: string;
    newId: string;
  }[]) {
  const updatedTable = currentTable.concat(docComparisonTable)
  const dir = path.join(process.cwd(), 'data');
  const filePath = path.join(dir, 'docs-comparison-table.json');
  // fs.removeSync(filePath)
  fs.mkdirpSync(dir);

  fs.writeFileSync(filePath, JSON.stringify(updatedTable, null, 2));

  log('Docs Comparison table saved locally.');
}

// Function to read a batch file
const readBatchFile = (batchNumber: number): PrismicDocument[] => {
  const filePath = path.join(process.cwd(), `data/new-assets-prismic-documents/batch-${batchNumber}.json`);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContent);
};

// Function to read a batch file
const readFinalBatchFile = (batchNumber: number): PrismicDocument[] => {
  const filePath = path.join(process.cwd(), `data/new-links-prismic-documents/batch-${batchNumber}.json`);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContent);
};

// Function to read the asset count
export const readDocsCount = (): number => {
  const filePath = path.join(process.cwd(), `data/prismic-documents/count.json`);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContent).length;
};

// Create docs and store new docs
export const createDocs = async (batchNumber: number, token: string) => {

  // Create a map for quick lookup
  const docIdMap: {
    olDid: string;
    newId: string;
  }[] = [];

  const batchCount = Math.ceil(readDocsCount() / docBatchSize)

  if (batchNumber <= batchCount) {
    const docs = readBatchFile(batchNumber);

    const currentTable = readDocsComparisonTable()
    const currentTableMap = new Map(currentTable.map(entry => [entry.olDid, entry.newId]));
    const overlap = docs.filter(item => currentTableMap.has(item.id))
    if (overlap.length === 0) {
      for (let j = 0; j < Math.min(docBatchSize, readDocsCount() - (docBatchSize * (batchCount - 1))); j++) {
        const doc = docs[j];

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
            docIdMap.push({ olDid: doc.id, newId: newDoc.id });
          } else {
            throw Error(
              "Request failed for doc of type : " +
              doc.type +
              " and uid: " +
              doc.uid +
              " Error details : " +
              (await response.text())
            );
          }
          await delay(2000);
        } catch (err) {
          throw Error("Error while uploading new document: " + err)
        }
      }
      updateDocComparisonTable(docIdMap, currentTable)
    }
    else {
      console.error('Some docs already exist in comparison table, check batch number and retry');
    }
  }
};


// Function to read the asset comparison table
const readDocsComparisonTable = (): { olDid: string, newId: string }[] => {
  const filePath = path.join(process.cwd(), `data/docs-comparison-table.json`);
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  }
  else return []
};

// Replace assetIDs in all docs
export const updateDocsWithLinks = () => {
  const docsComparisonTable = readDocsComparisonTable();
  // Create a map from the comparison table for quick lookup
  const idMap = new Map(docsComparisonTable.map(entry => [entry.olDid, entry.newId]));

  const mutatedDocs: (PrismicDocument & { title: string })[] = [];
  const batchCount = Math.ceil(readDocsCount() / docBatchSize)

  for (let i = 1; i <= batchCount; i++) {
    const docs = readBatchFile(i);

    docs.forEach((document) => {
      const mutatedDoc: PrismicDocument & { title: string } = {
        ...document,
        title: "Title",
      };

      if (document && document.data) {
        mutatedDoc.data = replaceIdsInObject(document.data, idMap)
        mutatedDoc.id = idMap.get(document.id)!
      }
      mutatedDocs.push(mutatedDoc);
    });
  }

  saveDocumentsInBatches(mutatedDocs, path.join(process.cwd(), 'data/new-links-prismic-documents'))
};

// Repush updates docs
export const updateDocs = async (batchNumber:number, token: string) => {

  const batchCount = Math.ceil(readDocsCount() / docBatchSize)

  if (batchNumber <= batchCount) {
    const docs = readFinalBatchFile(batchNumber);

    for (let j = 0; j < Math.min(docBatchSize, readDocsCount() - (docBatchSize * (batchCount - 1))); j++) {
      const doc = docs[j];

      // Send the update
      try {
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
        if (response.ok) {
          log(
            "Document updated of type : " +
            doc.type +
            " and uid: " +
            doc.uid,
            1
          );
        } else {
          await delay(2000);
          console.error(
            "Request failed for doc of type : " +
            doc.type +
            " and uid: " +
            doc.uid +
            ". Make sure you published once all your migration docs. Error details : " +
            (await response.text())
          );
        }

        await delay(2000);
      } catch (err) {
        console.error("Error while uploading new document: ", err);
      }
    }
  }
};
