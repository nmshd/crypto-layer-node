# `crypto-layer-node`

[![NPM Version](https://img.shields.io/npm/v/%40nmshd%2Frs-crypto-node)](https://www.npmjs.com/package/@nmshd/rs-crypto-node)

**Node.js Addon providing TypeScript bindings for `rust-crypto` / `crypto-layer`.**

This is a Node.js Addon built with [Neon](https://github.com/neon-bindings) that implements 
the TypeScript bindings for [`rust-crypto` / `crypto-layer`](https://github.com/nmshd/rust-crypto).
The TypeScript interface definitions are provided by the [`@nmshd/rs-crypto-types`](https://github.com/nmshd/rust-crypto/tree/main/ts-types) package.

> [!WARNING]
> Currently crypto-layer errors are not correctly mapped to javascript errors. (See [#Debugging])

> [!WARNING]
> The key metadata storage uses sqlite. This means multiple processes may use the same database.
> But this also means that the file lock on a database is not released very fast.
> Deleting a database might not be immediately possible after dropping a provider.

> [!NOTE]
> MacOS and IOS providers are currently not included, as they'd require the nodejs addon to be signed.

## Usage

`crypto-layer-node` implements the [TypeScript API of `rust-crypto` / `crypto-layer`](https://github.com/nmshd/rust-crypto/tree/main/ts-types).
For documentation regarding the API head to [`rust-crypto`s documentation](https://github.com/nmshd/rust-crypto). 
(Currently no version of `rust-crypto` is released. Thus there is no build of the docs on docs.rs).

### Installation

```sh
npm i @nmshd/rs-crypto-types
npm i @nmshd/rs-crypto-node
```

### Example

Have a look at the example in [`./example`](./example/index.ts).

## Development && Building && Debugging

For development docs or for docs on how to build the project yourself see [`DEVELOPMENT.md`](./DEVELOPMENT.md).

## Acknowledgments

This project was bootstrapped by [create-neon](https://www.npmjs.com/package/create-neon).

## License

`crypto-layer-node` is licensed under the [MIT license](./LICENSE).
