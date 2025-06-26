import { test, expect, describe } from "@jest/globals";

import {
    ProviderImplConfig,
    Provider,
    KeySpec,
    KeyPairSpec,
    KDF,
} from "@nmshd/rs-crypto-types";

import { createProviderFromName } from "../lib/index.cjs";

import { SOFTWARE_PROVIDER_NAME, testDir } from "./common";
import { assertKeyHandle } from "@nmshd/rs-crypto-types/checks";

describe("test provider methods", () => {
    let provider: Provider;
    let cleanup: () => Promise<void>;
    let path: string;

    beforeAll(async () => {
        const folder = await testDir();
        path = folder.path;
        cleanup = folder.cleanup;
        const providerImplConfigWithFileStore: ProviderImplConfig = {
            additional_config: [{ FileStoreConfig: { db_dir: path } }],
        };
        const provider_or_null = await createProviderFromName(
            SOFTWARE_PROVIDER_NAME,
            providerImplConfigWithFileStore,
        );
        if (!provider_or_null) {
            throw Error("Failed initializing simple software provider.");
        }
        provider = provider_or_null;
    });

    afterAll(async () => {
        if (cleanup) await cleanup();
    });

    test("create aes gcm ephemeral key", async () => {
        const spec: KeySpec = {
            cipher: "AesGcm256",
            signing_hash: "Sha2_256",
            ephemeral: true,
            non_exportable: true,
        };

        const key = await provider.createKey(spec);
        expect(key).toBeDefined();
        expect(typeof key.id).toBe("function");
        expect(typeof key.decryptData).toBe("function");
        expect(typeof key.delete).toBe("function");
        expect(typeof key.encryptData).toBe("function");
        expect(typeof key.extractKey).toBe("function");
        expect(typeof key.spec).toBe("function");
    });

    test("create aes gcm ephemeral key and failed load", async () => {
        let id: string;
        {
            const spec: KeySpec = {
                cipher: "AesGcm256",
                signing_hash: "Sha2_256",
                ephemeral: true,
                non_exportable: true,
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
            const spec: KeySpec = {
                cipher: "AesGcm256",
                signing_hash: "Sha2_256",
                ephemeral: false,
                non_exportable: true,
            };

            const key = await provider.createKey(spec);
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
        const spec: KeyPairSpec = {
            asym_spec: "P256",
            cipher: null,
            signing_hash: "Sha2_256",
            ephemeral: false,
            non_exportable: false,
        };

        const keyPair = await provider.createKeyPair(spec);

        expect(keyPair).toBeDefined();
        expect(typeof keyPair.id).toBe("function");
        expect(typeof keyPair.decryptData).toBe("function");
        expect(typeof keyPair.delete).toBe("function");
        expect(typeof keyPair.encryptData).toBe("function");
        expect(typeof keyPair.extractKey).toBe("function");
        expect(typeof keyPair.spec).toBe("function");
        expect(typeof keyPair.getPublicKey).toBe("function");
        expect(typeof keyPair.signData).toBe("function");
        expect(typeof keyPair.verifySignature).toBe("function");
    });

    test("create P256 key pair and load", async () => {
        const spec: KeyPairSpec = {
            asym_spec: "P256",
            cipher: null,
            signing_hash: "Sha2_256",
            ephemeral: false,
            non_exportable: false,
        };

        const keyPair = await provider.createKeyPair(spec);

        const id = await keyPair.id();

        const loadedKeyPair = await provider.loadKeyPair(id);

        expect(loadedKeyPair.id()).resolves.toEqual(id);
        expect(loadedKeyPair.spec()).resolves.toEqual(spec);
    });

    test("create P256 key pair, export and import public key", async () => {
        const spec: KeyPairSpec = {
            asym_spec: "P256",
            cipher: null,
            signing_hash: "Sha2_256",
            ephemeral: false,
            non_exportable: false,
        };

        const keyPair = await provider.createKeyPair(spec);

        const rawPublicKey = await keyPair.getPublicKey();
        expect(rawPublicKey).toBeInstanceOf(Uint8Array);
        expect(rawPublicKey.length).toBeGreaterThan(0);

        expect(keyPair.extractKey()).resolves.toBeDefined();

        const publicKey = await provider.importPublicKey(spec, rawPublicKey);
        expect(publicKey).toBeDefined();
        expect(publicKey.spec()).resolves.toEqual(spec);

        expect(publicKey.getPublicKey()).resolves.toEqual(rawPublicKey);
        expect(publicKey.extractKey()).rejects.toThrow();
    });

    test("create P256 key pair, export and import key pair", async () => {
        const spec: KeyPairSpec = {
            asym_spec: "P256",
            cipher: null,
            signing_hash: "Sha2_256",
            ephemeral: false,
            non_exportable: false,
        };

        const keyPair = await provider.createKeyPair(spec);

        const rawPublicKey = await keyPair.getPublicKey();
        expect(rawPublicKey).toBeInstanceOf(Uint8Array);
        expect(rawPublicKey.length).toBeGreaterThan(0);

        const rawPrivateKey = await keyPair.extractKey();
        expect(rawPrivateKey).toBeInstanceOf(Uint8Array);
        expect(rawPrivateKey.length).toBeGreaterThan(0);

        const importedKeyPair = await provider.importKeyPair(
            spec,
            rawPublicKey,
            rawPrivateKey,
        );
        expect(importedKeyPair).toBeDefined();
        expect(await importedKeyPair.extractKey()).toEqual(rawPrivateKey);
        expect(await importedKeyPair.getPublicKey()).toEqual(rawPublicKey);
        expect(await importedKeyPair.spec()).toEqual(spec);
    });

    test("create P256 key pair, export and import private key", async () => {
        const spec: KeyPairSpec = {
            asym_spec: "P256",
            cipher: null,
            signing_hash: "Sha2_256",
            ephemeral: false,
            non_exportable: false,
        };

        const keyPair = await provider.createKeyPair(spec);

        const rawPublicKey = await keyPair.getPublicKey();
        expect(rawPublicKey).toBeInstanceOf(Uint8Array);
        expect(rawPublicKey.length).toBeGreaterThan(0);

        const rawPrivateKey = await keyPair.extractKey();
        expect(rawPrivateKey).toBeInstanceOf(Uint8Array);
        expect(rawPrivateKey.length).toBeGreaterThan(0);

        const importedKeyPair = await provider.importKeyPair(
            spec,
            new Uint8Array(0),
            rawPrivateKey,
        );
        expect(importedKeyPair).toBeDefined();
        expect(importedKeyPair.extractKey()).resolves.toEqual(rawPrivateKey);
        //expect(await importedKeyPair.getPublicKey()).toEqual(rawPublicKey); // TODO: Undefined behavior.
        expect(importedKeyPair.spec()).resolves.toEqual(spec);
    });

    test("get provider name", async () => {
        expect(provider.providerName()).resolves.toEqual(
            SOFTWARE_PROVIDER_NAME,
        );
    });

    test("get provider capabilities", async () => {
        const caps = await provider.getCapabilities();
        expect(caps).toBeDefined();
        expect(typeof caps?.max_security_level).toEqual("string");
        expect(typeof caps?.min_security_level).toEqual("string");
        expect(caps?.min_security_level).toEqual(caps?.max_security_level);
        expect(Array.isArray(caps?.supported_asym_spec)).toBe(true);
        expect(Array.isArray(caps?.supported_ciphers)).toBe(true);
        expect(Array.isArray(caps?.supported_hashes)).toBe(true);
        expect(caps?.supported_asym_spec.length).toBeGreaterThan(0);
        expect(caps?.supported_ciphers.length).toBeGreaterThan(0);
        expect(caps?.supported_hashes.length).toBeGreaterThan(0);
        expect(typeof caps?.supported_asym_spec[0]).toEqual("string");
        expect(typeof caps?.supported_ciphers[0]).toEqual("string");
        expect(typeof caps?.supported_hashes[0]).toEqual("string");
    });

    test("derive key from password and salt", async () => {
        const spec: KeySpec = {
            cipher: "AesGcm256",
            signing_hash: "Sha2_256",
            ephemeral: true,
            non_exportable: true,
        };

        const kdf: KDF = {
            Argon2d: {
                memory: 8192,
                iterations: 1,
                parallelism: 1,
            },
        };

        const keyHandle = await provider.deriveKeyFromPassword(
            "password1234",
            new Uint8Array([
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
            ]),
            spec,
            kdf,
        );
        assertKeyHandle(keyHandle);
        expect(keyHandle.spec()).resolves.toEqual(spec);
    });

    test("get random", async () => {
        const randomBytes = await provider.getRandom(256);
        expect(randomBytes).toBeInstanceOf(Uint8Array);
        expect(randomBytes.length).toEqual(256);
    });

    test("hash data", async () => {
        const data = Uint8Array.from([1, 2, 3, 4, 5, 6, 7, 8]);
        const hash = await provider.hash(data, "Sha2_256");
        const hash2 = await provider.hash(data, "Sha2_256");

        expect(hash).toBeInstanceOf(Uint8Array);
        expect(hash.length).toBeGreaterThan(0);
        expect(hash).toEqual(hash2);
    });
}); // end describe
