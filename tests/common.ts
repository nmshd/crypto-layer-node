import { dir, DirectoryResult } from "tmp-promise";

export const SOFTWARE_PROVIDER_NAME = "SoftwareProvider";

export async function testDir(): Promise<DirectoryResult> {
    return await dir({
        unsafeCleanup: true,
    });
}
