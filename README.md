# crypto-layer-node

[![NPM Version](https://img.shields.io/npm/v/%40nmshd%2Frs-crypto-node)](https://www.npmjs.com/package/@nmshd/rs-crypto-node)

> [!WARNING]
> Currently this node plugin crashes quite ungracefully. (See [#Debugging])

> [!WARNING]
> File storage works with fs locks and closing is sluggish.
> Closing and reopening a provider with the same file store might result in an db lock error.

**Crypto Layer TS interface for nodejs.**

This project was bootstrapped by [create-neon](https://www.npmjs.com/package/create-neon).

## Building crypto-layer-node

Building crypto-layer-node requires a [supported version of Node and Rust](https://github.com/neon-bindings/neon#platform-support).

To run the build, run:

```pwsh
npm i
npm run build
```

This command uses the [@neon-rs/cli](https://www.npmjs.com/package/@neon-rs/cli) utility to assemble the binary Node addon from the output of `cargo`.

## Debugging

- Compile the library with debug:

    ```
    npm run debug
    ```

- Activate logging:

    ```bash
    RUST_LOG=trace
    ```

    ```pwsh
    $env:RUST_LOG="trace"
    ```

    Available levels are `trace`, `debug`, `info`, `warn` and `error`.

    It is possible to filter according to modules (see the [docs](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html)).

    ```pwsh
    $env:RUST_LOG="crypto_layer_node=trace,crypto_layer=warn"
    ```

- Activate full backtrace:

    ```bash
    RUST_BACKTRACE=full
    ```

    ```pwsh
    $env:RUST_BACKTRACE="full"
    ```

## Available Scripts

In the project directory, you can run:

#### `npm run build`

Builds the Node addon (`index.node`) from source, generating a release build with `cargo --release`.

Additional [`cargo build`](https://doc.rust-lang.org/cargo/commands/cargo-build.html) arguments may be passed to `npm run build` and similar commands. For example, to enable a [cargo feature](https://doc.rust-lang.org/cargo/reference/features.html):

```
npm run build -- --feature=beetle
```

#### `npm run debug`

Similar to `npm run build` but generates a debug build with `cargo`.

#### `npm run cross`

Similar to `npm run build` but uses [cross-rs](https://github.com/cross-rs/cross) to cross-compile for another platform. Use the [`CARGO_BUILD_TARGET`](https://doc.rust-lang.org/cargo/reference/config.html#buildtarget) environment variable to select the build target.

#### `npm run release`

Initiate a full build and publication of a new patch release of this library via GitHub Actions.

#### `npm run dryrun`

Initiate a dry run of a patch release of this library via GitHub Actions. This performs a full build but does not publish the final result.

#### `npm test`

Runs the unit tests written with `jest`.

The project must be compiled with `npm run debug` (recommended) or `npm run build` beforehand.

Consider running the tests with logging and full backtrace:

```bash
RUST_LOG=info RUST_BACKTRACE=full npm test
```

## Project Layout

The directory structure of this project is:

```
node-plugin/
├── Cargo.toml
├── README.md
├── lib/
├── src/
|   ├── index.mts
|   └── index.cts
├── crates/
|   └── crypto-layer-ts/
|       └── src/
|           └── lib.rs
├── platforms/
├── package.json
└── target/
```

| Entry          | Purpose                                                                                                                            |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `Cargo.toml`   | The Cargo [manifest file](https://doc.rust-lang.org/cargo/reference/manifest.html), which informs the `cargo` command.             |
| `README.md`    | This file.                                                                                                                         |
| `lib/`         | The directory containing the generated output from [tsc](https://typescriptlang.org).                                              |
| `src/`         | The directory containing the TypeScript source files.                                                                              |
| `index.mts`    | Entry point for when this library is loaded via [ESM `import`](https://nodejs.org/api/esm.html#modules-ecmascript-modules) syntax. |
| `index.cts`    | Entry point for when this library is loaded via [CJS `require`](https://nodejs.org/api/modules.html#requireid).                    |
| `crates/`      | The directory tree containing the Rust source code for the project.                                                                |
| `lib.rs`       | Entry point for the Rust source code.                                                                                              |
| `platforms/`   | The directory containing distributions of the binary addon backend for each platform supported by this library.                    |
| `package.json` | The npm [manifest file](https://docs.npmjs.com/cli/v7/configuring-npm/package-json), which informs the `npm` command.              |
| `target/`      | Binary artifacts generated by the Rust build.                                                                                      |

## Learn More

Learn more about:

- [Neon](https://neon-bindings.com).
- [Rust](https://www.rust-lang.org).
- [Node](https://nodejs.org).
