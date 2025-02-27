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

describe("test provider methods", () => {
    const PROVIDER_DB_DIR_PATH = DB_DIR_PATH + "/provider";

    const providerImplConfigWithFileStore: ProviderImplConfig = {
        additional_config: [
            { FileStoreConfig: { db_dir: PROVIDER_DB_DIR_PATH } },
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

    test("create aes gcm ephemeral key", async () => {
        const spec: KeySpec = {
            cipher: "AesGcm256",
            signing_hash: "Sha2_256",
            ephemeral: true,
        };

        const key = await provider.createKey(spec);
        expect(key).toBeDefined();
        expect(key.id).toBeDefined();
        expect(typeof key.id).toBe("function");
        expect(key.decryptData).toBeDefined();
        expect(typeof key.decryptData).toBe("function");
        expect(key.delete).toBeDefined();
        expect(typeof key.delete).toBe("function");
        expect(key.encryptData).toBeDefined();
        expect(typeof key.encryptData).toBe("function");
        expect(key.extractKey).toBeDefined();
        expect(typeof key.extractKey).toBe("function");
        expect(key.spec).toBeDefined();
        expect(typeof key.spec).toBe("function");
    });

    test("create aes gcm ephemeral key and failed load", async () => {
        let id: string;
        {
            let spec: KeySpec = {
                cipher: "AesGcm256",
                signing_hash: "Sha2_256",
                ephemeral: true,
            };

            const key = await provider.createKey(spec);
            id = await key.id();

            // console.log("id:", id);
        }
        expect(provider.loadKey(id)).rejects.toThrow();
    });

    test("create aes gcm key and load", async () => {
        let id: string;
        {
            let spec: KeySpec = {
                cipher: "AesGcm256",
                signing_hash: "Sha2_256",
                ephemeral: false,
            };

            let key = await provider.createKey(spec);
            id = await key.id();
        }
        const loadedKey = await provider.loadKey(id);
        expect(loadedKey).toBeDefined();
        expect(loadedKey.id()).resolves.toEqual(id);
    });

    // TODO: Extraction of symmetric keys is not implemented yet.
    /* test("create aes gcm key, export, delete and import", () => {
        let spec: KeySpec = {
            cipher: "AesGcm256",
            signing_hash: "Sha2_256",
            ephemeral: false
        };

        let key = provider.createKey(spec);
        let hello_msg: Uint8Array = Buffer.from("Hello World!");

        let encrypted_data = key.encryptData(hello_msg);
        let exported_key = key.extractKey();

        key.delete();

        expect(() => {
            key.id();
        }).toThrow();

        let imported_key = provider.importKey(spec, exported_key);
        let decrypted_data = imported_key.decryptData(...encrypted_data);
        expect(decrypted_data).toEqual(hello_msg);
    }); */

    test("create P256 key pair", async () => {
        let spec: KeyPairSpec = {
            asym_spec: "P256",
            cipher: null,
            signing_hash: "Sha2_256",
            ephemeral: false,
            non_exportable: false,
        };

        let keyPair = await provider.createKeyPair(spec);

        expect(keyPair).toBeDefined();
        expect(keyPair.id).toBeDefined();
        expect(typeof keyPair.id).toBe("function");
        expect(keyPair.decryptData).toBeDefined();
        expect(typeof keyPair.decryptData).toBe("function");
        expect(keyPair.delete).toBeDefined();
        expect(typeof keyPair.delete).toBe("function");
        expect(keyPair.encryptData).toBeDefined();
        expect(typeof keyPair.encryptData).toBe("function");
        expect(keyPair.extractKey).toBeDefined();
        expect(typeof keyPair.extractKey).toBe("function");
        expect(keyPair.spec).toBeDefined();
        expect(typeof keyPair.spec).toBe("function");
        expect(keyPair.getPublicKey).toBeDefined();
        expect(typeof keyPair.getPublicKey).toBe("function");
        expect(keyPair.signData).toBeDefined();
        expect(typeof keyPair.signData).toBe("function");
        expect(keyPair.verifySignature).toBeDefined();
        expect(typeof keyPair.verifySignature).toBe("function");
    });

    test("create P256 key pair and load", async () => {
        let spec: KeyPairSpec = {
            asym_spec: "P256",
            cipher: null,
            signing_hash: "Sha2_256",
            ephemeral: false,
            non_exportable: false,
        };

        let keyPair = await provider.createKeyPair(spec);

        let id = await keyPair.id();

        let loadedKeyPair = await provider.loadKeyPair(id);

        expect(loadedKeyPair.id()).resolves.toEqual(id);
        expect(loadedKeyPair.spec()).resolves.toEqual(spec);
    });

    test("create P256 key pair, export and import public key", async () => {
        let spec: KeyPairSpec = {
            asym_spec: "P256",
            cipher: null,
            signing_hash: "Sha2_256",
            ephemeral: false,
            non_exportable: false,
        };

        let keyPair = await provider.createKeyPair(spec);

        let rawPublicKey = await keyPair.getPublicKey();
        expect(rawPublicKey).toBeInstanceOf(Uint8Array);
        expect(rawPublicKey.length).toBeGreaterThan(0);

        expect(keyPair.extractKey()).resolves.toBeDefined();

        let publicKey = await provider.importPublicKey(spec, rawPublicKey);
        expect(publicKey).toBeDefined();
        expect(publicKey.spec()).resolves.toEqual(spec);

        expect(publicKey.getPublicKey()).resolves.toEqual(rawPublicKey);
        expect(publicKey.extractKey()).rejects.toThrow();
    });

    test("create P256 key pair, export and import key pair", async () => {
        let spec: KeyPairSpec = {
            asym_spec: "P256",
            cipher: null,
            signing_hash: "Sha2_256",
            ephemeral: false,
            non_exportable: false,
        };

        let keyPair = await provider.createKeyPair(spec);

        let rawPublicKey = await keyPair.getPublicKey();
        expect(rawPublicKey).toBeInstanceOf(Uint8Array);
        expect(rawPublicKey.length).toBeGreaterThan(0);

        let rawPrivateKey = await keyPair.extractKey();
        expect(rawPrivateKey).toBeInstanceOf(Uint8Array);
        expect(rawPrivateKey.length).toBeGreaterThan(0);

        let importedKeyPair = await provider.importKeyPair(
            spec,
            rawPublicKey,
            rawPrivateKey
        );
        expect(importedKeyPair).toBeDefined();
        expect(await importedKeyPair.extractKey()).toEqual(rawPrivateKey);
        expect(await importedKeyPair.getPublicKey()).toEqual(rawPublicKey);
        expect(await importedKeyPair.spec()).toEqual(spec);
    });

    test("create P256 key pair, export and import private key", async () => {
        let spec: KeyPairSpec = {
            asym_spec: "P256",
            cipher: null,
            signing_hash: "Sha2_256",
            ephemeral: false,
            non_exportable: false,
        };

        let keyPair = await provider.createKeyPair(spec);

        let rawPublicKey = await keyPair.getPublicKey();
        expect(rawPublicKey).toBeInstanceOf(Uint8Array);
        expect(rawPublicKey.length).toBeGreaterThan(0);

        let rawPrivateKey = await keyPair.extractKey();
        expect(rawPrivateKey).toBeInstanceOf(Uint8Array);
        expect(rawPrivateKey.length).toBeGreaterThan(0);

        let importedKeyPair = await provider.importKeyPair(
            spec,
            new Uint8Array(0),
            rawPrivateKey
        );
        expect(importedKeyPair).toBeDefined();
        expect(importedKeyPair.extractKey()).resolves.toEqual(rawPrivateKey);
        //expect(await importedKeyPair.getPublicKey()).toEqual(rawPublicKey); // TODO: Undefined behaviour.
        expect(importedKeyPair.spec()).resolves.toEqual(spec);
    });

    test("get provider name", async () => {
        expect(provider.providerName()).resolves.toEqual(
            SOFTWARE_PROVIDER_NAME
        );
    });

    test("get provider capabilities", async () => {
        expect(provider.getCapabilities()).resolves.toBeTruthy();
    });
});
