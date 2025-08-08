# `crypto-layer-node`

[![NPM Version](https://img.shields.io/npm/v/%40nmshd%2Frs-crypto-node)](https://www.npmjs.com/package/@nmshd/rs-crypto-node)

**Crypto Layer TS interface for nodejs.**

> [!WARNING]
> Currently crypto-layer errors are not correctly mapped to javascript errors. (See [#Debugging])

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
