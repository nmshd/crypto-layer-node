import { test, expect, describe } from "@jest/globals";

import {
    KeySpec,
    ProviderConfig,
    ProviderImplConfig,
} from "@nmshd/rs-crypto-types";
import {
    createProvider,
    getAllProviders,
    createProviderFromName,
    getProviderCapabilities,
} from "../lib/index.cjs";

import { DB_DIR_PATH, SOFTWARE_PROVIDER_NAME } from "./common";
import {
    assertKeyHandle,
    assertProvider,
    assertProviderConfig,
} from "@nmshd/rs-crypto-types/checks";

describe("test provider factory methods", () => {
    const FACTORY_DB_DIR_PATH = DB_DIR_PATH + "/factory";

    const providerConfig: ProviderConfig = {
        max_security_level: "Software",
        min_security_level: "Software",
        supported_asym_spec: ["P256"],
        supported_ciphers: ["AesGcm256"],
        supported_hashes: ["Sha2_256"],
    };

    test("get provider names", async () => {
        const provider_arr = await getAllProviders();
        expect(provider_arr).toBeTruthy();
        for (const name of provider_arr) {
            expect(typeof name).toEqual("string");
            expect(name).toBeTruthy();
        }
        expect(provider_arr).toContain(SOFTWARE_PROVIDER_NAME);
    });

    test("create provider from config with file store", async () => {
        const providerImplConfigWithFileStore: ProviderImplConfig = {
            additional_config: [
                { FileStoreConfig: { db_dir: FACTORY_DB_DIR_PATH } },
            ],
        };
        const provider = await createProvider(
            providerConfig,
            providerImplConfigWithFileStore,
        );

        assertProvider(provider);
        expect(provider?.providerName()).resolves.toEqual(
            SOFTWARE_PROVIDER_NAME,
        );
    });

    test("create software provider from name with file store", async () => {
        const providerImplConfigWithFileStore: ProviderImplConfig = {
            additional_config: [
                {
                    FileStoreConfig: {
                        db_dir: FACTORY_DB_DIR_PATH + "FromName",
                    },
                },
            ],
        };
        const provider = await createProviderFromName(
            SOFTWARE_PROVIDER_NAME,
            providerImplConfigWithFileStore,
        );

        assertProvider(provider);
        expect(provider?.providerName()).resolves.toEqual(
            SOFTWARE_PROVIDER_NAME,
        );
    });

    test("test get provider capabilities", async () => {
        const emptyProviderConfig: ProviderImplConfig = {
            additional_config: [],
        };
        const providerCapsList =
            await getProviderCapabilities(emptyProviderConfig);
        expect(providerCapsList).toBeDefined();
        expect(Array.isArray(providerCapsList)).toEqual(true);
        expect(providerCapsList.length).toBeGreaterThanOrEqual(0);
        for (const [name, caps] of providerCapsList) {
            expect(typeof name).toEqual("string");
            expect(name).toBeTruthy();
            assertProviderConfig(caps);
        }
    });

    test("create software provider secured via a key handle", async () => {
        const temporaryProviderConfig: ProviderImplConfig = {
            additional_config: [],
        };
        const temporaryProvider = await createProviderFromName(
            SOFTWARE_PROVIDER_NAME,
            temporaryProviderConfig,
        );

        if (!temporaryProvider)
            throw new Error("Failed creating an ephemeral software provider.");

        const keySpecMasterKey: KeySpec = {
            cipher: "AesGcm256",
            signing_hash: "Sha2_512",
            ephemeral: true,
            non_exportable: true,
        };
        const masterKey = await temporaryProvider.createKey(keySpecMasterKey);

        const securedAdditionalConfig: ProviderImplConfig = {
            additional_config: [
                { StorageConfigHMAC: masterKey },
                { StorageConfigSymmetricEncryption: masterKey },
                {
                    FileStoreConfig: {
                        db_dir:
                            FACTORY_DB_DIR_PATH + "securedProviderByKeyHandle",
                    },
                },
            ],
        };
        console.log(securedAdditionalConfig);
        const securedProvider = await createProviderFromName(
            SOFTWARE_PROVIDER_NAME,
            securedAdditionalConfig,
        );

        if (!securedProvider)
            throw new Error("Failed creating a secured software provider.");

        assertProvider(securedProvider);

        const keySpecSecureProvider: KeySpec = {
            cipher: "AesGcm256",
            signing_hash: "Sha2_512",
            ephemeral: false,
            non_exportable: true,
        };
        let id: string;
        {
            const keyHandle = await securedProvider.createKey(
                keySpecSecureProvider,
            );
            assertKeyHandle(keyHandle);
            id = await keyHandle.id();
        }
        {
            const keyHandle = await securedProvider.loadKey(id);
            assertKeyHandle(keyHandle);
        }
    });

    /* test("create software provider validated through a key pair handle", async () => {
        const temporaryProviderConfig: ProviderImplConfig = {
            additional_config: [],
        };
        const temporaryProvider = await createProviderFromName(
            SOFTWARE_PROVIDER_NAME,
            temporaryProviderConfig,
        );

        if (!temporaryProvider)
            throw new Error("Failed creating an ephemeral software provider.");

        const keyPairSpecMasterKey: KeyPairSpec = {
            asym_spec: "P256",
            cipher: null,
            signing_hash: "Sha2_512",
            ephemeral: true,
            non_exportable: true,
        };

        const signingKey =
            await temporaryProvider.createKeyPair(keyPairSpecMasterKey);

        const securedAdditionalConfig: ProviderImplConfig = {
            additional_config: [
                { StorageConfigDSA: signingKey },
                {
                    FileStoreConfig: {
                        db_dir:
                            FACTORY_DB_DIR_PATH +
                            "securedProviderByKeyPairHandle",
                    },
                },
            ],
        };
        const securedProvider = await createProviderFromName(
            SOFTWARE_PROVIDER_NAME,
            securedAdditionalConfig,
        );

        if (!securedProvider)
            throw new Error("Failed creating a secured software provider.");

        assertProvider(securedProvider);

        const keySpecSecureProvider: KeySpec = {
            cipher: "AesGcm256",
            signing_hash: "Sha2_512",
            ephemeral: false,
            non_exportable: true,
        };
        let id: string;
        {
            const keyHandle = await securedProvider.createKey(
                keySpecSecureProvider,
            );
            assertKeyHandle(keyHandle);
            id = await keyHandle.id();
        }
        {
            const keyHandle = await securedProvider.loadKey(id);
            assertKeyHandle(keyHandle);
        }
    }); */
});
