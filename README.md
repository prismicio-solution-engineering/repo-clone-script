# Overview

This script facilitates the copying of documents (up to a thousand) and assets from one Prismic repository to another.  
It can be used to populate a new repository with documents quickly based on a `custom starter` Prismic repository.

The script will copy the documents that are currently available on your `custom starter` in the master language and import them along with the assets they might use in the target repository.

<br>

# Installation & Configuration

1. Install dependencies:
    ```sh
    npm install
    ```

2. Create a `.env` file from the `.env.sample` and fill the required configuration
    ```plaintext
    TEMPLATE_DOMAIN= <The Prismic repository of the custom starter you want to use>
    MIGRATION_API_BETA_KEY= <your Migration API key, see [Migration API docs](https://prismic.io/docs/migration-api-technical-reference#limits)>
    EMAIL= <email of your Prismic account>
    PASSWORD= <password of your Prismic account>
    ```

<br>

# Usage

To run the script, use the following command:
```
npm run start -- <target_repository>
```

This will start the process of copying documents and associated assets from the `custom starter` Prismic repository to the target repository.

<br>

# Limitation

- This script currently does not handle multi language starters.
- This script can handle up to 1000 documents as the migration release can only contain that much documents for now.

# Troubleshooting

If you encounter any issue while the script is running, technical logs can be uncommented to verify the validity of your data and resolve the issue.

# Documentation

Complete documentation on how to create a custom starter for Prismic [here](https://prismic.io/docs/starters)
