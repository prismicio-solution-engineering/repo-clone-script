# Overview

This script facilitates the copying of documents and assets from one Prismic repository to another.  
It can be used to instentiate a new repository quickly based on a `custom template` Prismic repository.

The script will copy the documents that are currently available on your `custom template` and import them along with the assets they might use in the target repository.

<br>

# Installation & Configuration

1. Install dependencies:
    ```sh
    npm install
    ```

2. Create a `.env` file from the `.env.sample` and fill the required configuration
    ```plaintext
    TEMPLATE_DOMAIN= <The custom template you want to use>
    MIGRATION_API_BETA_KEY= <your Migration API key>
    EMAIL= <email of your Prismic account>
    PASSWORD= <password of your Prismic account>
    ```

<br>

# Usage

To run the script, use the following command:
```
npm run start -- <target_repository>
```

This will start the process of copying documents and associated assets from the `custom template` Prismic repository to the target repository.

<br>

# Documentation

Complete documentation on how to create a custom starter for Prismic [here](https://prismic.io/docs/starters)