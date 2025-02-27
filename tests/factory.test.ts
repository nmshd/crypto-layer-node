import { test, expect, describe } from "@jest/globals";

import {
    ProviderConfig,
    ProviderImplConfig,
    CreateProviderFromNameFunc,
    CreateProviderFunc,
    GetAllProvidersFunc,
} from "@nmshd/rs-crypto-types";
import {
    createProvider,
    getAllProviders,
    createProviderFromName,
    getProviderCapabilities,
} from "../lib/index.cjs";

import { DB_DIR_PATH, SOFTWARE_PROVIDER_NAME } from "./common";
import { GetProviderCapabilitiesFunc } from "@nmshd/rs-crypto-types/manual";

describe("test provider factory methods", () => {
    const FACTORY_DB_DIR_PATH = DB_DIR_PATH + "/factory";

    let providerConfig: ProviderConfig = {
        max_security_level: "Software",
        min_security_level: "Software",
        supported_asym_spec: ["P256"],
        supported_ciphers: ["AesGcm256"],
        supported_hashes: ["Sha2_256"],
    };

    test("get provider names", async () => {
        let provider_arr = await getAllProviders();
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
                { StorageConfigPass: "1234" },
            ],
        };
        const provider = await createProvider(
            providerConfig,
            providerImplConfigWithFileStore
        );
        expect(provider).toBeDefined();
        expect(typeof provider?.createKey).toBe("function");
        expect(typeof provider?.createKeyPair).toBe("function");
        expect(typeof provider?.getCapabilities).toBe("function");
        expect(typeof provider?.importKey).toBe("function");
        expect(typeof provider?.importKeyPair).toBe("function");
        expect(typeof provider?.importPublicKey).toBe("function");
        expect(typeof provider?.loadKey).toBe("function");
        expect(typeof provider?.loadKeyPair).toBe("function");
        expect(typeof provider?.providerName).toBe("function");
        expect(typeof provider?.startEphemeralDhExchange).toBe("function");
    });

    test("create software provider from name with file store", async () => {
        let providerImplConfigWithFileStore: ProviderImplConfig = {
            additional_config: [
                {
                    FileStoreConfig: {
                        db_dir: FACTORY_DB_DIR_PATH + "FromName",
                    },
                },
                { StorageConfigPass: "1234" },
            ],
        };
        const provider = await createProviderFromName(
            SOFTWARE_PROVIDER_NAME,
            providerImplConfigWithFileStore
        );
        expect(provider).toBeDefined();
        expect(typeof provider?.createKey).toBe("function");
        expect(typeof provider?.createKeyPair).toBe("function");
        expect(typeof provider?.getCapabilities).toBe("function");
        expect(typeof provider?.importKey).toBe("function");
        expect(typeof provider?.importKeyPair).toBe("function");
        expect(typeof provider?.importPublicKey).toBe("function");
        expect(typeof provider?.loadKey).toBe("function");
        expect(typeof provider?.loadKeyPair).toBe("function");
        expect(typeof provider?.providerName).toBe("function");
        expect(typeof provider?.startEphemeralDhExchange).toBe("function");
    });

    test("functions fullfilling defined types", async () => {
        let _a: GetAllProvidersFunc = getAllProviders;
        let _b: CreateProviderFromNameFunc = createProviderFromName;
        let _c: CreateProviderFunc = createProvider;
        let _d: GetProviderCapabilitiesFunc = getProviderCapabilities;
    });

    test("test get provider capabilities", async () => {
        let emptyProviderConfig: ProviderImplConfig = {
            additional_config: [],
        };
        let providerCapsList = await getProviderCapabilities(
            emptyProviderConfig
        );
        expect(providerCapsList).toBeDefined();
        expect(Array.isArray(providerCapsList)).toEqual(true);
        expect(providerCapsList.length).toBeGreaterThanOrEqual(0);
        for (const [name, caps] of providerCapsList) {
            expect(typeof name).toEqual("string");
            expect(name).toBeTruthy();
            expect(caps).toBeDefined();
            expect(typeof caps.max_security_level).toEqual("string");
            expect(typeof caps.min_security_level).toEqual("string");
            expect(Array.isArray(caps.supported_asym_spec)).toEqual(true);
            for (const item of caps.supported_asym_spec) {
                expect(typeof item).toEqual("string");
                expect(item).toBeTruthy();
            }
            expect(Array.isArray(caps.supported_ciphers)).toEqual(true);
            for (const item of caps.supported_ciphers) {
                expect(typeof item).toEqual("string");
                expect(item).toBeTruthy();
            }
            expect(Array.isArray(caps.supported_hashes)).toEqual(true);
            for (const item of caps.supported_hashes) {
                expect(typeof item).toEqual("string");
                expect(item).toBeTruthy();
            }
        }
    });
});
