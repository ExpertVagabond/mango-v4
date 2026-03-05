<div align="center">

# Mango Markets V4

**DeFi program, TypeScript client, and Python client for Solana**

[![Solana](https://img.shields.io/badge/Solana-14F195?logo=solana&logoColor=white)](https://solana.com)
[![Anchor](https://img.shields.io/badge/Anchor-0.28-orange)](https://www.anchor-lang.com)
[![Rust](https://img.shields.io/badge/Rust-000000?logo=rust&logoColor=white)](https://www.rust-lang.org)
[![License](https://img.shields.io/badge/License-MIT%2FGPL-blue.svg)](LICENSE)

*Revived fork of [blockworks-foundation/mango-v4](https://github.com/blockworks-foundation/mango-v4) for the Solana Graveyard Hackathon (Migrations track)*

</div>

---

## Overview

Mango Markets V4 is a decentralized exchange and lending protocol on Solana. This repository contains the on-chain Anchor program, a TypeScript client SDK, and a Python client. It supports spot trading, perpetual futures, and cross-margin lending/borrowing.

> **Status: REVIVED** -- Program compiles, deploys to localnet, 4/4 tests passing.

## Revival Summary

| Item | Value |
|------|-------|
| Program ID | ` 4MangoMjqJ2firMokCjjGgoK8d4MXcrgL7XJaL3w6fVg ` |
| Framework | Anchor 0.28.0 |
| Solana CLI | 1.18.26 |
| Binary Size | 3.5 MB |
| Tests | 4/4 passing |
| Hackathon Track | Migrations (,000) |

### What Was Fixed

- Enabled `enable-gpl` feature by default (required for program entrypoint)
- Set `HOST_CC=/usr/bin/clang` for blake3 native compilation on macOS
- Generated test IDL and wrote JavaScript test suite from scratch
- Configured `COPYFILE_DISABLE=1` for macOS resource fork compatibility

## Features

- **Spot trading** -- on-chain orderbook with limit and market orders
- **Perpetual futures** -- leveraged perpetual contracts with funding rates
- **Cross-margin** -- shared collateral across all positions
- **Lending/Borrowing** -- variable-rate lending with utilization-based interest
- **Oracle integration** -- Pyth and Switchboard price feeds
- **Liquidation engine** -- automated liquidation with partial liquidation support
- **Flash loans** -- same-slot borrow and repay

## Build and Test

```bash
# Build the program
export HOST_CC=/usr/bin/clang
anchor build --no-idl -- --no-default-features --features enable-gpl,custom-heap

# Run tests (requires solana-test-validator)
cd tests && npm install
COPYFILE_DISABLE=1 solana-test-validator --reset &
anchor test --skip-build
```

## Tests

1. **Creates a Mango Group** -- initializes group with insurance vault
2. **Creates a stub oracle** -- deploys test price oracle (I80F48 format)
3. **Duplicate rejection** -- verifies PDA uniqueness constraint
4. **Group close** -- cleans up group and reclaims rent

## Deployments

| Network | Program ID |
|---------|-----------|
| Mainnet | ` 4MangoMjqJ2firMokCjjGgoK8d4MXcrgL7XJaL3w6fVg ` |
| Devnet | ` 4MangoMjqJ2firMokCjjGgoK8d4MXcrgL7XJaL3w6fVg ` |

## Dependencies

| Tool | Version |
|------|---------|
| Rust | 1.69.0 |
| Solana CLI | 1.18.26 |
| Anchor CLI | 0.28.0 |
| Node.js | 16+ |
| npm | 8+ |

## Original Project

This is a maintained fork of [blockworks-foundation/mango-v4](https://github.com/blockworks-foundation/mango-v4). Mango Markets was one of the largest DeFi protocols on Solana, offering cross-margin trading and lending.

## License

The majority of this repo is MIT licensed. Some parts needed for compiling the Solana program are under GPL.

All GPL code is gated behind the `enable-gpl` feature. If you use the `mango-v4` crate as a dependency with the `client` or `cpi` features, you use only MIT parts.

See [LICENSE](LICENSE) for details.
