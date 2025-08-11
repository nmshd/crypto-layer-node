import { mkdtemp } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { existsSync, rmSync } from "node:fs";

// Add global.gc type declaration for Node.js --expose-gc flag
declare global {
    var gc: NodeJS.GCFunction | undefined;
}

export const SOFTWARE_PROVIDER_NAME = "SoftwareProvider";

export async function setupDbDir(): Promise<string> {
    return await mkdtemp(join(tmpdir(), "crypto-layer-node-tests-"));
}

export function teardownDbDir(path: string | undefined): void {
    if (path !== undefined && existsSync(path) && path !== "/") {
        rmSync(path, { recursive: true, force: true });
    }
}

/**
 * Starts garbage collection with a lengthy time out.
 *
 * This is strictly necessary, as as long as a provider is not destroyed the sqlite file lock is not released
 * and thus the temporary directories cannot be deleted.
 */
export async function gcAllAndWait() {
    if (global.gc) {
        for (let i = 0; i < 2; i++) {
            global.gc();
            await new Promise((resolve) => setTimeout(resolve, 300));
        }
    }
}
