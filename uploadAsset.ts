import fs from "fs-extra";
import FormData from "form-data";
import fetch from "node-fetch";
import "dotenv/config";
import path from "path";

const assetUrl = `https://asset-api.prismic.io/assets`;
const token = '' //PLACE WRITE API TOKEN
const repoName = '' // PLACE REPO NAME
const fileName = '' // PLACE YOUR ASSET FILENAME

// Upload Asset File query
const uploadFile = async (token: string) => {
    const formData = new FormData();
    formData.append("file", fs.createReadStream(path.join(process.cwd(),fileName)));
  
    const response = await fetch(assetUrl, {
      method: "POST",
      body: formData,
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${token}`,
        "x-api-key": "CCNIlI0Vz41J66oFwsHUXaZa6NYFIY6z7aDF62Bc",
        repository: repoName,
        Accept: "application/json",
        "User-Agent": "prismic-clone-script-assets-api",
      },
    });
  
    if (!response.ok) {
      throw new Error(`Failed to upload file: ${response.statusText}`);
    }
  
    const json = await response.json();
    return {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers.raw(),
      data: json as { id: string },
    };
  };
  
  uploadFile(token)