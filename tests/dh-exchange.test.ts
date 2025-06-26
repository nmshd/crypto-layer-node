import { test, expect, describe } from "@jest/globals";

import {
    ProviderImplConfig,
    Provider,
    KeyPairSpec,
    KeySpec,
} from "@nmshd/rs-crypto-types";
import { createProviderFromName } from "../lib/index.cjs";

import { DB_DIR_PATH, SOFTWARE_PROVIDER_NAME } from "./common";

function checkIfKeySpecIsDerivedFromKeyPairSpec(
    keySpec: KeySpec,
    keyPairSpec: KeyPairSpec,
): void {
    expect(keySpec.cipher).toEqual(keyPairSpec.cipher);
    expect(keySpec.ephemeral).toEqual(keyPairSpec.ephemeral);
    expect(keySpec.signing_hash).toEqual(keyPairSpec.signing_hash);
}

describe("test dh exchange", () => {
    const KEY_HANDLE_DB_DIR_PATH = DB_DIR_PATH + "/dh_exchange";

    const providerImplConfigWithFileStore: ProviderImplConfig = {
        additional_config: [
            { FileStoreConfig: { db_dir: KEY_HANDLE_DB_DIR_PATH } },
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
        cipher: "AesGcm256",
        signing_hash: "Sha2_256",
        ephemeral: false,
        non_exportable: false,
    };

    test("dh exchange between server and client raw keys", async () => {
        const clientExchange = await provider.startEphemeralDhExchange(spec);
        const serverExchange = await provider.startEphemeralDhExchange(spec);
        const clientPublicKey = await clientExchange.getPublicKey();
        const serverPublicKey = await serverExchange.getPublicKey();

        const [clientRx, clientTx] =
            await clientExchange.deriveClientSessionKeys(serverPublicKey);
        const [serverRx, serverTx] =
            await serverExchange.deriveServerSessionKeys(clientPublicKey);
        expect(clientRx).toBeInstanceOf(Uint8Array);
        expect(clientRx.length).toBeGreaterThan(0);
        expect(clientTx).toBeInstanceOf(Uint8Array);
        expect(clientTx.length).toBeGreaterThan(0);
        expect(serverRx).toBeInstanceOf(Uint8Array);
        expect(serverRx.length).toBeGreaterThan(0);
        expect(serverTx).toBeInstanceOf(Uint8Array);
        expect(serverTx.length).toBeGreaterThan(0);

        expect(clientRx).toEqual(serverTx);
        expect(clientTx).toEqual(serverRx);
    });

    test("dh exchange between server and client key handle", async () => {
        const clientExchange = await provider.startEphemeralDhExchange(spec);
        const serverExchange = await provider.startEphemeralDhExchange(spec);
        const clientPublicKey = await clientExchange.getPublicKey();
        const serverPublicKey = await serverExchange.getPublicKey();

        const [clientRx, clientTx] =
            await clientExchange.deriveClientKeyHandles(serverPublicKey);
        const [serverRx, serverTx] =
            await serverExchange.deriveServerKeyHandles(clientPublicKey);

        const rawClientRx = await clientRx.extractKey();
        const rawClientTx = await clientRx.extractKey();
        const rawServerRx = await clientRx.extractKey();
        const rawServerTx = await clientRx.extractKey();

        expect(rawClientRx).toBeInstanceOf(Uint8Array);
        expect(rawClientRx.length).toBeGreaterThan(0);
        expect(rawClientTx).toBeInstanceOf(Uint8Array);
        expect(rawClientTx.length).toBeGreaterThan(0);
        expect(rawServerRx).toBeInstanceOf(Uint8Array);
        expect(rawServerRx.length).toBeGreaterThan(0);
        expect(rawServerTx).toBeInstanceOf(Uint8Array);
        expect(rawServerTx.length).toBeGreaterThan(0);

        expect(clientRx).toEqual(serverTx);
        expect(clientTx).toEqual(serverRx);

        checkIfKeySpecIsDerivedFromKeyPairSpec(await clientRx.spec(), spec);
        checkIfKeySpecIsDerivedFromKeyPairSpec(await clientTx.spec(), spec);
        checkIfKeySpecIsDerivedFromKeyPairSpec(await serverRx.spec(), spec);
        checkIfKeySpecIsDerivedFromKeyPairSpec(await serverTx.spec(), spec);
    });
});
