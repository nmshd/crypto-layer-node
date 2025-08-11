import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { argv, exit } from "node:process";

const sourceFileDir = dirname(fileURLToPath(import.meta.url));
const packageRootDir = join(sourceFileDir, "..");
const packageJsonPath = join(packageRootDir, "package.json");

const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

const currentVersion = packageJson.version;
console.log("Current version: ", currentVersion);

if (argv.length !== 3) {
    console.log("USAGE: node update-version.node.mjs [patch/minor/major]");
    exit(1);
}
if (!["patch", "minor", "major"].includes(argv[2])) {
    console.log(
        `'${argv[2]}' is not a valid argument. Valid arguments are patch, minor, major`,
    );
    exit(1);
}

execSync(`npm --no-git-tag-version version ${argv[2]}`, {
    cwd: packageRootDir,
    stdio: "inherit",
});

const packageJsonContent = readFileSync(packageJsonPath, "utf-8");
const packageJsonFileParsed = JSON.parse(packageJsonContent);

const newVersion = packageJsonFileParsed.version;
console.log("New version: ", newVersion);

packageJsonFileParsed.optionalDependencies[
    "@nmshd/rs-crypto-node-win32-x64-msvc"
] = newVersion;
packageJsonFileParsed.optionalDependencies["@nmshd/rs-crypto-node-darwin-x64"] =
    newVersion;
packageJsonFileParsed.optionalDependencies[
    "@nmshd/rs-crypto-node-darwin-arm64"
] = newVersion;
packageJsonFileParsed.optionalDependencies[
    "@nmshd/rs-crypto-node-linux-x64-gnu"
] = newVersion;

writeFileSync(packageJsonPath, JSON.stringify(packageJsonFileParsed, null, 2));

console.log("Success!");
