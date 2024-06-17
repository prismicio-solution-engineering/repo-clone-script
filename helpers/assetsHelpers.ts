import fetch from 'node-fetch';
import fs from "fs-extra";
import path from 'path';
import FormData from "form-data";
import { docBatchSize } from '../steps/constants';
import { PrismicDocument } from '@prismicio/client';
import { saveDocumentsInBatches } from './fileHelpers';
import { readDocsCount } from './docHelpers';
import { log } from '../ui/cli';

const assetUrl = `https://asset-api.prismic.io/assets`;

// Type definitions for the comparison table
interface ComparisonEntry {
    olDid: string;
    newId: string;
    url: string;
    fileName: string;
}

interface MediaItem {
    id: string;
    url: string;
    filename: string;
    size: number;
    last_modified: number;
    kind: string;
    extension: string;
    created_at: number;
    tags: string[];
}

interface MediaResponse {
    total: number;
    items: MediaItem[];
    cursor?: string;
}

export async function listAssets(repository: string, token: string): Promise<MediaResponse> {
    const endpoint = 'https://asset-api.prismic.io/assets';
    const limit = 100;

    async function fetchAssets(cursor?: string): Promise<MediaResponse> {
        const headers = {
            'repository': repository,
            'authorization': `Bearer ${token}`,
        };

        const url = new URL(endpoint);
        url.searchParams.append('limit', limit.toString());
        if (cursor) {
            url.searchParams.append('cursor', cursor);
        }

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            throw new Error(`Error fetching assets: ${response.statusText}`);
        }

        return response.json() as Promise<MediaResponse>;
    }

    async function fetchAllAssets(): Promise<MediaItem[]> {
        let allItems: MediaItem[] = [];
        let cursor: string | undefined = undefined;
        let total: number | undefined = undefined;

        while (true) {
            const data = await fetchAssets(cursor);
            allItems = allItems.concat(data.items);
            cursor = data.cursor;

            if (total === undefined) {
                total = data.total;
            }

            if (allItems.length >= total) {
                break;
            }
        }

        return allItems;
    }

    try {
        const allItems = await fetchAllAssets();
        return {
            total: allItems.length,
            items: allItems,
        };
    } catch (error) {
        console.error('Failed to fetch assets:', error);
        throw error;
    }
}

export function saveAssetList(list: MediaResponse) {
    const dir = path.join(process.cwd(), 'data');
    const filePath = path.join(dir, 'assets-list.json');
    fs.removeSync(filePath)
    fs.mkdirpSync(dir);

    fs.writeFileSync(filePath, JSON.stringify(list, null, 2));

    log('Asset List saved locally.');
}

// Delay function
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Function to download a file
const downloadFile = async (url: string, filepath: string) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to download file: ${response.statusText}`);
    const fileStream = fs.createWriteStream(filepath);
    await new Promise((resolve, reject) => {
        response.body!.pipe(fileStream);
        response.body!.on('error', reject);
        fileStream.on('finish', resolve);
    });
};

// Function to upload a file
const uploadFile = async (filePath: string, token: string, apiKey: string, repository: string) => {
    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath));

    const response = await fetch(assetUrl, {
        method: "POST",
        body: formData,
        headers: {
            ...formData.getHeaders(),
            Authorization: `Bearer ${token}`,
            "x-api-key": apiKey,
            repository: repository,
            Accept: "application/json",
            "User-Agent": "prismic-clone-script",
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to upload file: ${response.statusText}`);
    }

    await delay(2000);

    const json = await response.json();
    return {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers.raw(),
        data: json as { id: string }
    };
};

// Main function to process all assets
export const processAssets = async (assets: MediaResponse, token: string, apiKey: string, repository: string) => {

    // Instantiate asset comparison table
    const assetComparisonTable: {
        olDid: string;
        url: string;
        fileName: string;
        newId: string;
    }[] = assets.items.map((item) => { return { olDid: item.id, url: item.url, fileName: item.filename, newId: "" } })

    for (let index = 0; index < assets.items.length; index++) {
        const dir = path.join(process.cwd(), 'data');
        fs.mkdirpSync(dir);
        const filePath = path.join(dir, assets.items[index].filename);
        try {
            // Download the file
            await downloadFile(assets.items[index].url, filePath);

            // Upload the file
            const uploadResponse = await uploadFile(filePath, token, apiKey, repository);

            // Delete the file after uploading
            fs.unlinkSync(filePath);

            // Store new in comparison table
            assetComparisonTable[index].newId = uploadResponse.data.id;
            log(`Uploaded Asset: ${filePath}`, 1);

        } catch (error) {
            console.error(`Error processing ${assets.items[index].filename}:`, error);
        }
    }
    saveAssetComparisonTable(assetComparisonTable)
};

export function saveAssetComparisonTable(assetComparisonTable: {
    olDid: string;
    url: string;
    fileName: string;
    newId: string;
}[]) {
    const dir = path.join(process.cwd(), 'data');
    const filePath = path.join(dir, 'assets-comparison-table.json');
    fs.removeSync(filePath)
    fs.mkdirpSync(dir);

    fs.writeFileSync(filePath, JSON.stringify(assetComparisonTable, null, 2));

    log('Asset Comparison table saved locally.');
}

// Function to read a batch file
const readBatchFile = (batchNumber: number): PrismicDocument[] => {
    const filePath = path.join(process.cwd(), `data/prismic-documents/batch-${batchNumber}.json`);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
};

// Function to read the asset comparison table
const readAssetComparisonTable = (): ComparisonEntry[] => {
    const filePath = path.join(process.cwd(), `data/assets-comparison-table.json`);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
};

// Function to read a batch file
export const readAssetList = (): MediaResponse => {
    const filePath = path.join(process.cwd(), `data/assets-list.json`);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
};

// Replace assetIDs in all docs
export const mutateDocs = () => {
    const assetComparisonTable = readAssetComparisonTable();
    // Create a map from the comparison table for quick lookup
    const idMap = new Map(assetComparisonTable.map(entry => [entry.olDid, entry.newId]));

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
            }
            mutatedDocs.push(mutatedDoc);
        });
    }

    saveDocumentsInBatches(mutatedDocs, path.join(process.cwd(), 'data/new-assets-prismic-documents'))
};

// Function to replace IDs in an object based on a comparison table
export function replaceIdsInObject(obj: any, idMap: Map<string, string>): any {

    // Helper function to replace ids in id fields
    const replaceId = (value: any): any => {
        if (typeof value === 'string' && idMap.has(value)) {
            return idMap.get(value);
        } else if (Array.isArray(value)) {
            return value.map(item => replaceId(item));
        } else if (typeof value === 'object' && value !== null) {
            return replaceIdsInObject(value, idMap);
        }
        return value;
    };

    // Process each property in the object
    const result: any = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            result[key] = replaceId(obj[key]);
        }
    }
    return result;
}