import { test, expect, describe } from "@jest/globals";

import {
    ProviderConfig,
    ProviderImplConfig,
    Provider,
    KeySpec,
    KeyHandle,
    KeyPairSpec,
} from "@nmshd/rs-crypto-types";
import {
    createProvider,
    getAllProviders,
    createProviderFromName,
} from "../lib/index.cjs";

import { DB_DIR_PATH, SOFTWARE_PROVIDER_NAME } from "./common";

describe("test key pair handle methods", () => {
    const KEY_HANDLE_DB_DIR_PATH = DB_DIR_PATH + "/key_pair_handle";

    let providerImplConfigWithFileStore: ProviderImplConfig = {
        additional_config: [
            { FileStoreConfig: { db_dir: KEY_HANDLE_DB_DIR_PATH } },
            { StorageConfigPass: "1234" },
        ],
    };

    let provider: Provider;
    beforeAll(async () => {
        let provider_or_null = await createProviderFromName(
            SOFTWARE_PROVIDER_NAME,
            providerImplConfigWithFileStore
        );
        if (!provider_or_null) {
            throw Error("Failed initializing simple software provider.");
        }
        provider = provider_or_null;
    });

    let spec: KeyPairSpec = {
        asym_spec: "P256",
        cipher: null,
        signing_hash: "Sha2_256",
        ephemeral: false,
        non_exportable: false,
    };

    test("id", async () => {
        const keyPair = await provider.createKeyPair(spec);
        const id = await keyPair.id();
        expect(id).toBeDefined();
        expect(id).toBeTruthy();
        expect(typeof id).toBe("string");
    });

    test("delete", async () => {
        const keyPair = await provider.createKeyPair(spec);
        const id = await keyPair.id();
        await keyPair.delete();
        // expect(await key_pair.id()).rejects.toThrow() // TODO: Fix delete functionality.
        expect(provider.loadKeyPair(id)).rejects.toThrow();
    });

    test("spec", async () => {
        const keyPair = await provider.createKeyPair(spec);
        expect(keyPair.spec()).resolves.toEqual(spec);
    });

    test("getPublicKey", async () => {
        const keyPair = await provider.createKeyPair(spec);
        const rawPublicKey = await keyPair.getPublicKey();
        expect(rawPublicKey).toBeInstanceOf(Uint8Array);
        expect(rawPublicKey.length).toBeGreaterThan(0);
    });

    test("extractKey", async () => {
        const keyPair = await provider.createKeyPair(spec);
        const rawPrivateKey = await keyPair.extractKey();
        expect(rawPrivateKey).toBeInstanceOf(Uint8Array);
        expect(rawPrivateKey.length).toBeGreaterThan(0);
    });

    test("sign and verify data", async () => {
        const keyPair = await provider.createKeyPair(spec);
        const data = Uint8Array.from([1, 2, 3, 4]);

        const signature = await keyPair.signData(data);
        expect(signature).toBeInstanceOf(Uint8Array);
        expect(signature.length).toBeGreaterThan(0);
        expect(keyPair.verifySignature(data, signature)).resolves.toBe(true);
    });

    // TODO: not yet implemented for software provider.
    /* test("encrypt and decrypt data", () => {
        let key = provider.createKeyPair(spec);
        let hello_msg: Uint8Array = Buffer.from("Hello World!");

        let encrypted_data = key.encryptData(hello_msg);

        let decrypted_data = key.decryptData(encrypted_data);

        expect(decrypted_data).toEqual(hello_msg);
    }); */
});
