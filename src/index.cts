// This module is the CJS entry point for the library.

// The Rust addon.
export { getAllProviders, getProviderCapabilities } from "./load.cjs";

import type {
    Provider,
    ProviderConfig,
    ProviderImplConfig,
    KeyHandle,
    KeyPairHandle,
    KeyPairSpec,
    KeySpec,
    DHExchange,
    KDF,
    CryptoHash,
} from "@nmshd/rs-crypto-types";

import {
    createBareProvider,
    providerName,
    signData,
    verifySignature,
    idForKeyHandle,
    idForKeyPair,
    deleteForKeyHandle,
    deleteForKeyPair,
    decryptDataForKeyHandle,
    decryptDataForKeyPairHandle,
    encryptDataForKeyHandle,
    encryptDataForKeyPairHandle,
    extractKeyForKeyHandle,
    getPublicKey,
    createBareKey,
    createBareKeyPair,
    loadBareKey,
    loadBareKeyPair,
    importBareKey,
    importBareKeyPair,
    importBarePublicKey,
    createBareProviderFromName,
    getCapabilities,
    startEphemeralDhExchange,
    dhExchangeFromKeys,
    getPublicKeyForDHExchange,
    // addExternalFinalForDHExchange,
    // addExternalForDHExchange,
    deriveClientSessionKeys,
    deriveServerSessionKeys,
    deriveClientKeyHandles,
    deriveServerKeyHandles,
    specForKeyHandle,
    specForKeyPairHandle,
    extractKeyForKeyPairHandle,
    deriveKeyFromPassword,
    getRandom,
    deriveKeyFromBase,
    hash,
    startDhExchangeForKeyPairHandle,
    deriveKeyForKeyHandle,
    encryptForKeyHandle,
    encryptWithIvForKeyHandle,
} from "./load.cjs";

type BareProvider = object;
type BareKeyHandle = object;
type BareKeyPairHandle = object;
type BareDHExchange = object;

// Use this declaration to assign types to the addon's exports,
// which otherwise by default are `any`.
declare module "./load.cjs" {
    // root
    function getAllProviders(): Promise<string[]>;
    function createBareProvider(
        config: ProviderConfig,
        impl_config: ProviderImplConfig,
    ): Promise<BareProvider | undefined>;
    function createBareProviderFromName(
        name: string,
        impl_config: ProviderImplConfig,
    ): Promise<BareProvider | undefined>;
    function getProviderCapabilities(
        providerImplConfig: ProviderImplConfig,
    ): Promise<[string, ProviderConfig][]>;

    // Provider
    function providerName(this: BareProvider): Promise<string>;
    function createBareKey(
        this: BareProvider,
        spec: KeySpec,
    ): Promise<BareKeyHandle>;
    function createBareKeyPair(
        this: BareProvider,
        spec: KeyPairSpec,
    ): Promise<BareKeyPairHandle>;
    function loadBareKey(
        this: BareProvider,
        id: string,
    ): Promise<BareKeyHandle>;
    function loadBareKeyPair(
        this: BareProvider,
        id: string,
    ): Promise<BareKeyPairHandle>;
    function importBareKey(
        this: BareProvider,
        spec: KeySpec,
        key: Uint8Array,
    ): Promise<BareKeyHandle>;
    function importBareKeyPair(
        this: BareProvider,
        spec: KeyPairSpec,
        publicKey: Uint8Array,
        privateKey: Uint8Array,
    ): Promise<BareKeyPairHandle>;
    function importBarePublicKey(
        this: BareProvider,
        spec: KeyPairSpec,
        publicKey: Uint8Array,
    ): Promise<BareKeyPairHandle>;
    function getCapabilities(
        this: BareProvider,
    ): Promise<ProviderConfig | undefined>;
    function startEphemeralDhExchange(
        this: BareProvider,
        spec: KeyPairSpec,
    ): Promise<BareDHExchange>;
    function dhExchangeFromKeys(
        this: BareProvider,
        publicKey: Uint8Array,
        privateKey: Uint8Array,
        spec: KeyPairSpec,
    ): Promise<BareDHExchange>;
    function deriveKeyFromPassword(
        password: string,
        salt: Uint8Array,
        algorithm: KeySpec,
        kdf: KDF,
    ): Promise<KeyPairHandle>;
    function deriveKeyFromBase(
        this: BareProvider,
        baseKey: Uint8Array,
        keyId: number,
        context: string,
        spec: KeySpec,
    ): Promise<KeyHandle>;
    function getRandom(this: BareProvider, len: number): Promise<Uint8Array>;
    function hash(
        this: BareProvider,
        input: Uint8Array,
        hash: CryptoHash,
    ): Promise<Uint8Array>;

    // KeyPairHandle
    function signData(
        this: BareKeyPairHandle,
        data: Uint8Array,
    ): Promise<Uint8Array>;
    function verifySignature(
        this: BareKeyPairHandle,
        data: Uint8Array,
        signature: Uint8Array,
    ): Promise<boolean>;
    function idForKeyPair(this: BareKeyPairHandle): Promise<string>;
    function deleteForKeyPair(this: BareKeyPairHandle): Promise<undefined>;
    function getPublicKey(this: BareKeyPairHandle): Promise<Uint8Array>;
    function extractKeyForKeyPairHandle(
        this: BareKeyPairHandle,
    ): Promise<Uint8Array>;
    function encryptDataForKeyPairHandle(
        this: BareKeyPairHandle,
        data: Uint8Array,
        iv: Uint8Array,
    ): Promise<Uint8Array>;
    function decryptDataForKeyPairHandle(
        this: BareKeyPairHandle,
        data: Uint8Array,
    ): Promise<Uint8Array>;
    function specForKeyPairHandle(
        this: BareKeyPairHandle,
    ): Promise<KeyPairSpec>;
    function startDhExchangeForKeyPairHandle(
        this: BareKeyPairHandle,
    ): Promise<DHExchange>;

    // KeyHandle
    function idForKeyHandle(this: BareKeyHandle): Promise<string>;
    function deleteForKeyHandle(this: BareKeyHandle): Promise<undefined>;
    function extractKeyForKeyHandle(this: BareKeyHandle): Promise<Uint8Array>;
    function encryptDataForKeyHandle(
        this: BareKeyHandle,
        data: Uint8Array,
        iv: Uint8Array,
    ): Promise<[Uint8Array, Uint8Array]>;
    function encryptForKeyHandle(
        this: BareKeyHandle,
        data: Uint8Array,
    ): Promise<[Uint8Array, Uint8Array]>;
    function encryptWithIvForKeyHandle(
        this: BareKeyHandle,
        data: Uint8Array,
        iv: Uint8Array,
    ): Promise<Uint8Array>;
    function decryptDataForKeyHandle(
        this: BareKeyHandle,
        data: Uint8Array,
        iv: Uint8Array,
    ): Promise<Uint8Array>;
    function specForKeyHandle(this: BareKeyHandle): Promise<KeySpec>;
    function deriveKeyForKeyHandle(
        this: BareKeyHandle,
        nonce: Uint8Array,
    ): Promise<KeyHandle>;

    // DHExchange
    function getPublicKeyForDHExchange(
        this: BareDHExchange,
    ): Promise<Uint8Array>;
    /* function addExternalForDHExchange(
        this: BareDHExchange,
        key: Uint8Array
    ): Promise<Uint8Array>;
    function addExternalFinalForDHExchange(
        this: BareDHExchange,
        key: Uint8Array
    ): Promise<BareKeyHandle>; */
    function deriveClientSessionKeys(
        serverPk: Uint8Array,
    ): Promise<[Uint8Array, Uint8Array]>;
    function deriveServerSessionKeys(
        clientPk: Uint8Array,
    ): Promise<[Uint8Array, Uint8Array]>;
    function deriveClientKeyHandles(
        serverPk: Uint8Array,
    ): Promise<[KeyHandle, KeyHandle]>;
    function deriveServerKeyHandles(
        clientPk: Uint8Array,
    ): Promise<[KeyHandle, KeyHandle]>;
}

class NodeProvider implements Provider {
    private provider: BareProvider;

    constructor(bareProvider: BareProvider) {
        this.provider = bareProvider;
    }

    async providerName(): Promise<string> {
        return await providerName.call(this.provider);
    }

    async createKey(spec: KeySpec): Promise<KeyHandle> {
        return new NodeKeyHandle(await createBareKey.call(this.provider, spec));
    }

    async createKeyPair(spec: KeyPairSpec): Promise<KeyPairHandle> {
        return new NodeKeyPairHandle(
            await createBareKeyPair.call(this.provider, spec),
        );
    }

    async loadKey(id: string): Promise<KeyHandle> {
        return new NodeKeyHandle(await loadBareKey.call(this.provider, id));
    }

    async loadKeyPair(id: string): Promise<KeyPairHandle> {
        return new NodeKeyPairHandle(
            await loadBareKeyPair.call(this.provider, id),
        );
    }

    async importKey(spec: KeySpec, key: Uint8Array): Promise<KeyHandle> {
        return new NodeKeyHandle(
            await importBareKey.call(this.provider, spec, key),
        );
    }

    async importKeyPair(
        spec: KeyPairSpec,
        publicKey: Uint8Array,
        privateKey: Uint8Array,
    ): Promise<KeyPairHandle> {
        return new NodeKeyPairHandle(
            await importBareKeyPair.call(
                this.provider,
                spec,
                publicKey,
                privateKey,
            ),
        );
    }

    async importPublicKey(
        spec: KeyPairSpec,
        publicKey: Uint8Array,
    ): Promise<KeyPairHandle> {
        return new NodeKeyPairHandle(
            await importBarePublicKey.call(this.provider, spec, publicKey),
        );
    }

    async startEphemeralDhExchange(spec: KeyPairSpec): Promise<DHExchange> {
        return new NodeDHExchange(
            await startEphemeralDhExchange.call(this.provider, spec),
        );
    }

    async dhExchangeFromKeys(
        publicKey: Uint8Array,
        privateKey: Uint8Array,
        spec: KeyPairSpec,
    ): Promise<DHExchange> {
        return new NodeDHExchange(
            await dhExchangeFromKeys.call(
                this.provider,
                publicKey,
                privateKey,
                spec,
            ),
        );
    }

    async getCapabilities(): Promise<ProviderConfig | undefined> {
        return await getCapabilities.call(this.provider);
    }

    async deriveKeyFromPassword(
        password: string,
        salt: Uint8Array,
        algorithm: KeySpec,
        kdf: KDF,
    ): Promise<KeyHandle> {
        return new NodeKeyHandle(
            await deriveKeyFromPassword.call(
                this.provider,
                password,
                salt,
                algorithm,
                kdf,
            ),
        );
    }

    async deriveKeyFromBase(
        baseKey: Uint8Array,
        keyId: number,
        context: string,
        spec: KeySpec,
    ): Promise<KeyHandle> {
        return new NodeKeyHandle(
            await deriveKeyFromBase.call(
                this.provider,
                baseKey,
                keyId,
                context,
                spec,
            ),
        );
    }

    async getRandom(len: number): Promise<Uint8Array> {
        return await getRandom.call(this.provider, len);
    }

    async hash(input: Uint8Array, hashAlgo: CryptoHash): Promise<Uint8Array> {
        return hash.call(this.provider, input, hashAlgo);
    }
}

class NodeKeyHandle implements KeyHandle {
    private keyHandle: BareKeyHandle;

    constructor(bareKeyHandle: BareKeyHandle) {
        this.keyHandle = bareKeyHandle;
    }

    async id(): Promise<string> {
        return await idForKeyHandle.call(this.keyHandle);
    }

    async delete(): Promise<undefined> {
        return await deleteForKeyHandle.call(this.keyHandle);
    }

    async extractKey(): Promise<Uint8Array> {
        return await extractKeyForKeyHandle.call(this.keyHandle);
    }

    async encryptData(
        data: Uint8Array,
        iv: Uint8Array,
    ): Promise<[Uint8Array, Uint8Array]> {
        return await encryptDataForKeyHandle.call(this.keyHandle, data, iv);
    }

    async encrypt(data: Uint8Array): Promise<[Uint8Array, Uint8Array]> {
        return await encryptForKeyHandle.call(this.keyHandle, data);
    }

    async encryptWithIv(data: Uint8Array, iv: Uint8Array): Promise<Uint8Array> {
        return await encryptWithIvForKeyHandle.call(this.keyHandle, data, iv);
    }

    async decryptData(
        encryptedData: Uint8Array,
        iv: Uint8Array,
    ): Promise<Uint8Array> {
        return await decryptDataForKeyHandle.call(
            this.keyHandle,
            encryptedData,
            iv,
        );
    }

    async spec(): Promise<KeySpec> {
        return await specForKeyHandle.call(this.keyHandle);
    }

    async deriveKey(nonce: Uint8Array): Promise<KeyHandle> {
        return new NodeKeyHandle(
            await deriveKeyForKeyHandle.call(this.keyHandle, nonce),
        );
    }
}

class NodeKeyPairHandle implements KeyPairHandle {
    private keyPairHandle: BareKeyPairHandle;

    constructor(bareKeyPairHandle: BareKeyPairHandle) {
        this.keyPairHandle = bareKeyPairHandle;
    }

    async id(): Promise<string> {
        return await idForKeyPair.call(this.keyPairHandle);
    }

    async delete(): Promise<undefined> {
        return await deleteForKeyPair.call(this.keyPairHandle);
    }

    async signData(data: Uint8Array): Promise<Uint8Array> {
        return await signData.call(this.keyPairHandle, data);
    }

    async verifySignature(
        data: Uint8Array,
        signature: Uint8Array,
    ): Promise<boolean> {
        return await verifySignature.call(this.keyPairHandle, data, signature);
    }

    async encryptData(data: Uint8Array, iv: Uint8Array): Promise<Uint8Array> {
        return await encryptDataForKeyPairHandle.call(
            this.keyPairHandle,
            data,
            iv,
        );
    }

    async decryptData(encryptedData: Uint8Array): Promise<Uint8Array> {
        return await decryptDataForKeyPairHandle.call(
            this.keyPairHandle,
            encryptedData,
        );
    }

    async getPublicKey(): Promise<Uint8Array> {
        return await getPublicKey.call(this.keyPairHandle);
    }

    async extractKey(): Promise<Uint8Array> {
        return await extractKeyForKeyPairHandle.call(this.keyPairHandle);
    }

    async spec(): Promise<KeyPairSpec> {
        return await specForKeyPairHandle.call(this.keyPairHandle);
    }

    async startDhExchange(): Promise<DHExchange> {
        return await startDhExchangeForKeyPairHandle.call(this.keyPairHandle);
    }
}

class NodeDHExchange implements DHExchange {
    private dhExchange: BareDHExchange;

    constructor(bareDHExchange: BareDHExchange) {
        this.dhExchange = bareDHExchange;
    }

    async getPublicKey(): Promise<Uint8Array> {
        return await getPublicKeyForDHExchange.call(this.dhExchange);
    }
    /* async addExternal(externalKey: Uint8Array): Promise<Uint8Array> {
        return await addExternalForDHExchange.call(
            this.dhExchange,
            externalKey
        );
    }
    async addExternalFinal(externalKey: Uint8Array): Promise<KeyHandle> {
        return new NodeKeyHandle(
            await addExternalFinalForDHExchange.call(
                this.dhExchange,
                externalKey
            )
        );
    } */
    async deriveClientSessionKeys(
        serverPk: Uint8Array,
    ): Promise<[Uint8Array, Uint8Array]> {
        return await deriveClientSessionKeys.call(this.dhExchange, serverPk);
    }
    async deriveServerSessionKeys(
        clientPk: Uint8Array,
    ): Promise<[Uint8Array, Uint8Array]> {
        return await deriveServerSessionKeys.call(this.dhExchange, clientPk);
    }
    async deriveClientKeyHandles(
        serverPk: Uint8Array,
    ): Promise<[KeyHandle, KeyHandle]> {
        const [rx, tx] = await deriveClientKeyHandles.call(
            this.dhExchange,
            serverPk,
        );
        return [new NodeKeyHandle(rx), new NodeKeyHandle(tx)];
    }
    async deriveServerKeyHandles(
        clientPk: Uint8Array,
    ): Promise<[KeyHandle, KeyHandle]> {
        const [rx, tx] = await deriveServerKeyHandles.call(
            this.dhExchange,
            clientPk,
        );
        return [new NodeKeyHandle(rx), new NodeKeyHandle(tx)];
    }
}

export async function createProvider(
    config: ProviderConfig,
    impl_config: ProviderImplConfig,
): Promise<Provider | undefined> {
    const provider = await createBareProvider(config, impl_config);
    if (!provider) {
        return undefined;
    }
    return new NodeProvider(provider);
}

export async function createProviderFromName(
    name: string,
    impl_config: ProviderImplConfig,
): Promise<Provider | undefined> {
    const provider = await createBareProviderFromName(name, impl_config);
    if (!provider) {
        return undefined;
    }
    return new NodeProvider(provider);
}
