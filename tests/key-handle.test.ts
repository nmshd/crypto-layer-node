import { test, expect, describe } from "@jest/globals";

import { ProviderImplConfig, Provider, KeySpec } from "@nmshd/rs-crypto-types";
import { createProviderFromName } from "../lib/index.cjs";

import { DB_DIR_PATH, SOFTWARE_PROVIDER_NAME } from "./common";

describe("test key handle methods", () => {
    const KEY_HANDLE_DB_DIR_PATH = DB_DIR_PATH + "/key_handle";

    const providerImplConfigWithFileStore: ProviderImplConfig = {
        additional_config: [
            { FileStoreConfig: { db_dir: KEY_HANDLE_DB_DIR_PATH } },
            { StorageConfigPass: "1234" },
        ],
    };

    let provider: Provider;
    beforeAll(async () => {
        const provider_or_null = await createProviderFromName(
            SOFTWARE_PROVIDER_NAME,
            providerImplConfigWithFileStore,
        );
        if (!provider_or_null) {
            throw Error("Failed initializing simple software provider.");
        }
        provider = provider_or_null;
    });

    const spec: KeySpec = {
        cipher: "AesGcm256",
        signing_hash: "Sha2_256",
        ephemeral: false,
    };

    test("id", async () => {
        const keyPair = await provider.createKey(spec);
        const id = await keyPair.id();
        expect(id).toBeDefined();
        expect(id).toBeTruthy();
        expect(typeof id).toBe("string");
    });

    test("delete", async () => {
        const key = await provider.createKey(spec);
        const id = await key.id();
        key.delete();
        expect(provider.loadKey(id)).rejects.toThrow();
    });

    test("encrypt and decrypt data", async () => {
        const [key, nonce] = await Promise.all([
            provider.createKey(spec),
            provider.getRandom(12),
        ]);
        const helloMsg: Uint8Array = Buffer.from("Hello World!");

        const encryptedData = await key.encryptData(helloMsg, nonce);
        expect(Array.isArray(encryptedData)).toBe(true);
        expect(encryptedData.length).toEqual(2);
        expect(encryptedData[0]).toBeDefined();
        expect(encryptedData[0]).toBeInstanceOf(Uint8Array);
        expect(encryptedData[1]).toBeDefined();
        expect(encryptedData[1]).toBeInstanceOf(Uint8Array);

        // console.log("data length: ", encrypted_data[0].length);
        // console.log("iv length: ", encrypted_data[1].length);

        const decryptedData = await key.decryptData(...encryptedData);

        expect(decryptedData).toBeDefined();
        expect(decryptedData).toBeInstanceOf(Uint8Array);
        expect(decryptedData.length).toBeGreaterThan(0);
        expect(Buffer.from(decryptedData).toString("utf8")).toEqual(
            "Hello World!",
        );
    });

    test("spec", async () => {
        const key = await provider.createKey(spec);
        expect(key.spec()).resolves.toEqual(spec);
    });
});
