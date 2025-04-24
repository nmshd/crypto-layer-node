import { test, expect, describe } from "@jest/globals";

import {
    ProviderImplConfig,
    Provider,
    KeyPairSpec,
} from "@nmshd/rs-crypto-types";
import { createProviderFromName } from "../lib/index.cjs";

import { DB_DIR_PATH, SOFTWARE_PROVIDER_NAME } from "./common";

describe("test key pair handle methods", () => {
    const KEY_HANDLE_DB_DIR_PATH = DB_DIR_PATH + "/key_pair_handle";

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

    const spec: KeyPairSpec = {
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

    // TODO: not implemented for software provider. DEPRECATED
    /* test("startDhExchange", async () => {
        const [clientKeyPairHandle, serverKeyPairHandle] = await Promise.all([
            provider.createKeyPair(spec),
            provider.createKeyPair(spec),
        ]);

        assertKeyPairHandle(clientKeyPairHandle);
        assertKeyPairHandle(serverKeyPairHandle);

        const [clientDhExchange, serverDhExchange] = await Promise.all([
            clientKeyPairHandle.startDhExchange(),
            serverKeyPairHandle.startDhExchange(),
        ]);

        assertDHExchange(clientDhExchange);
        assertDHExchange(serverDhExchange);

        const [clientPublicKey, serverPublicKey] = await Promise.all([
            clientDhExchange.getPublicKey(),
            serverDhExchange.getPublicKey(),
        ]);

        expect(Array.isArray(clientPublicKey)).toBe(true);
        expect(Array.isArray(serverPublicKey)).toBe(true);

        const [[clientRx, clientTx], [serverRx, serverTx]] = await Promise.all([
            clientDhExchange.deriveClientSessionKeys(serverPublicKey),
            serverDhExchange.deriveServerSessionKeys(clientPublicKey),
        ]);

        Array.isArray(clientPublicKey);

        expect(clientRx).toBeDefined();
        expect(clientRx).toEqual(serverTx);
        expect(clientTx).toBeDefined();
        expect(clientTx).toEqual(serverRx);
    }); */
});
