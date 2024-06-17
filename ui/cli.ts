import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';

import { readDocsCount } from '../helpers/docHelpers';

import { importDocs } from '../steps/importDocs';
import { reImportDocs } from '../steps/reImportDocs';
import { exportRepo } from '../steps/export';
import { importAssets } from '../steps/importAssets';
import { addAssetsIds } from '../steps/addAssetsIds';
import { addLinksIds } from '../steps/addLinksIds';
import { docBatchSize } from '../steps/constants';

const stateFilePath = path.join(process.cwd(), 'data', 'state.json');

const steps = [
    { name: "Export" },
    { name: "Import Assets" },
    { name: "Add Assets IDs" },
    { name: "Import Docs" },
    { name: "Add Links IDs" },
    { name: "Re-Import Docs" }
];

interface State {
    currentStep: number;
    batchCount?: number;
    importBatch: number;
    reImportBatch: number;
}

async function loadState(): Promise<State> {
    try {
        const data = await fs.readFile(stateFilePath, 'utf-8');
        return JSON.parse(data) as State;
    } catch (error) {
        // If the file does not exist or there's an error reading it, start from the beginning
        return { currentStep: 0, importBatch: 1, reImportBatch: 1 };
    }
}

async function saveState(state: State): Promise<void> {
    await fs.writeFile(stateFilePath, JSON.stringify(state, null, 2));
}

async function main() {
    log("Welcome to the Prismic Repo Clone Script Runner!");

    const state = await loadState();
    if (state.currentStep === 6) {
        log(`It seems all steps went through.`);
        return
    }
    const step = steps[state.currentStep];

    const answer = await inquirer.prompt({
        type: 'confirm',
        name: 'proceed',
        message: `Do you want to run the script for ${step.name}?`,
        default: true,
    });

    if (answer.proceed) {
        if (step.name === "Export") {
            const success = await exportRepo();
            if (!success) {
                log(`Failed to execute ${step.name}. Exiting.`);
            }
            else {
                log(`Success: ${step.name}`);
                state.batchCount = Math.ceil(readDocsCount() / docBatchSize)
                state.currentStep = state.currentStep + 1;
                await saveState(state);
            }
        } else if (step.name === "Import Assets") {
            const success = await importAssets();
            if (!success) {
                log(`Failed to execute ${step.name}. Exiting.`);
            }
            else {
                log(`Success: ${step.name}`);
                state.currentStep = state.currentStep + 1;
                await saveState(state);
            }
        } else if (step.name === "Add Assets IDs") {
            const success = await addAssetsIds();
            if (!success) {
                log(`Failed to execute ${step.name}. Exiting.`);
            }
            else {
                log(`Success: ${step.name}`);
                state.currentStep = state.currentStep + 1;
                await saveState(state);
            }
        } else if (step.name === "Import Docs") {
            if (!state.batchCount) {
                log("No batch numbers found in state. Exiting.");
            }
            else {
                const currentBatch = state.importBatch
                const success = await importDocs(currentBatch!.toString());
                if (!success) {
                    log(`Failed to execute ${step.name} for batch ${currentBatch}. Exiting.`);
                } else {
                    log(`Success: ${step.name}, ${state.importBatch}/${state.batchCount} batches imported`);
                    if (state.importBatch === state.batchCount) {
                        state.currentStep = state.currentStep + 1;
                    }
                    else {
                        state.importBatch = state.importBatch + 1;
                    }
                    await saveState(state);
                }
            }
        }
        else if (step.name === "Add Links IDs") {
            const success = await addLinksIds();
            if (!success) {
                log(`Failed to execute ${step.name}. Exiting.`);
            }
            else {
                log(`Success: ${step.name}`);
                state.currentStep = state.currentStep + 1;
                await saveState(state);
            }
        } else if (step.name === "Re-Import Docs") {
            if (!state.batchCount) {
                log("No batch numbers found in state. Exiting.");
            }
            else {
                const currentBatch = state.reImportBatch
                const success = await reImportDocs(currentBatch!.toString());
                if (!success) {
                    log(`Failed to execute ${step.name} for batch ${currentBatch}. Exiting.`);
                } else {
                    log(`Success: ${step.name}, ${state.reImportBatch}/${state.batchCount} batches re-imported`);
                    if (state.reImportBatch === state.batchCount) {
                        state.currentStep = state.currentStep + 1;
                    }
                    else {
                        state.reImportBatch = state.reImportBatch + 1;
                    }
                    await saveState(state);
                }
            }
        } else {
            log(`Unknown step, this is not an expected behavior, something is wrong in state.json. Exiting.`);
        }
    } else {
        log(`Cancelling ${step.name}.`);
    }
}

main().catch(error => {
    console.error(`Error in main execution: ${error}`);
});

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