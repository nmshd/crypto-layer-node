import { $ } from "bun";
import { join } from "node:path";

import packageJson from "../package.json";

const sourceFileDir = import.meta.dir;
const packageRootDir = join(sourceFileDir, "..");
const packageJsonPath = join(packageRootDir, "package.json");

const currentVersion: string = packageJson.version;
console.log("Current version: ", currentVersion);

if (Bun.argv.length !== 3) {
    console.log("USAGE: bun run update-version.bun.ts [patch/minor/major]");
    process.exit(1);
}
if (!["patch", "minor", "major"].includes(Bun.argv[2])) {
    console.log(
        `'${Bun.argv[2]}' is not a valid argument. Valid arguments are patch, minor, major`
    );
    process.exit(1);
}

const { stdout } = await $`npm --no-git-tag-version version ${Bun.argv[2]}`.cwd(
    packageRootDir
);
const newVersion = stdout.toString();
console.log("New version: ", newVersion);

const packageJsonFile = await Bun.file(packageJsonPath);
const packageJsonFileParsed = await packageJsonFile.json();

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

await Bun.write(
    packageJsonFile,
    JSON.stringify(packageJsonFileParsed, null, 2)
);

console.log("Success!");
