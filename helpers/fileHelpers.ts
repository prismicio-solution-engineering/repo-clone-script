import fs from "fs-extra";
import path from "path";
import type { PrismicDocument } from "@prismicio/client";
import { docBatchSize } from "../steps/constants";
import { log } from "../ui/cli";

export function clearDataFolder(dir :string) {
    cleanDirectory(dir)
    log('Cleared '+ dir +' folder.');
}

export function saveDocumentsInBatches(docs: PrismicDocument[], dir :string) {
    cleanDirectory(dir)
    log('Cleared '+ dir +' folder.');

    for (let i = 0; i < docs.length; i += docBatchSize) {
        const batch = docs.slice(i, i + docBatchSize);
        const filePath = path.join(dir, `batch-${Math.floor(i / docBatchSize) + 1}.json`);
        fs.writeFileSync(filePath, JSON.stringify(batch, null, 2));
    }

    const filePath = path.join(dir, `count.json`);
    fs.writeFileSync(filePath, JSON.stringify({length:docs.length}, null, 2));

    log('Documents saved in batches locally.');
}

export async function saveAssetComparisonTable(table: {
    olDid: string;
    url: string;
    fileName: string;
    newId: string;
}[]) {
    const filePath = path.join(process.cwd(),'data/comparison-tables/assets');
    await fs.remove(filePath)

    fs.writeFileSync(filePath, JSON.stringify(table, null, 2));

    log('Asset Comparison table saved locally.');
}

function cleanDirectory(dir: string) {
    fs.removeSync(dir);
    fs.mkdirpSync(dir);
}

export function readAllDocuments() {
    const dir = path.join(process.cwd(),'prismic-documents');
    const files = fs.readdirSync(dir);
    let allDocs : PrismicDocument[] = [];
  
    for (const file of files) {
      const filePath = path.join(dir, file);
      const batch = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      allDocs = allDocs.concat(batch);
    }
  
    return allDocs;
  }