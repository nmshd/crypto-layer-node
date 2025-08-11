/** @type {import('ts-jest').JestConfigWithTsJest} **/
export const testEnvironment = "node";
export const transform = {
    "^.+.tsx?$": ["ts-jest", {}],
};
export const testPathIgnorePatterns = ["/node_modules/", "/example/", "/lib/"];
