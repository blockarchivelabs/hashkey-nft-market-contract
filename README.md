# HashCubs NFT Market Smart Contracts

HashCubs is an NFT marketplace operating on the Hashkey Chain. This repository contains the smart contract code for the HashCubs marketplace platform.

## Features

- NFT listing and trading
- Dual payment support (HSK/WHSK)
- Collection management system
- Creator royalties
- Trading fee system
- Whitelist checker integration
- Upgradeable contract architecture

## Contract Architecture

### ERC721NFTMarketV2

The core marketplace contract with the following features:

- Upgradeable architecture using OpenZeppelin's upgradeable pattern
- NFT trading and listing management
- Fee management and distribution
- Collection management
- Security features including reentrancy protection

### Key Functions

1. **Listing Management**

   - `createAskOrder`: Create a new listing
   - `modifyAskOrder`: Update listing price
   - `cancelAskOrder`: Cancel an existing listing
   - `viewAsksByCollection`: View all listings for a collection
   - `viewAsksByCollectionAndSeller`: View listings by seller

2. **Purchase Functions**

   - `buyTokenUsingHSK`: Purchase NFT using native HSK
   - `buyTokenUsingWHSK`: Purchase NFT using wrapped HSK (WHSK)

3. **Collection Management**

   - `addCollection`: Add new collection to marketplace
   - `modifyCollection`: Update collection parameters
   - `closeCollectionForTradingAndListing`: Disable trading for a collection
   - `viewCollections`: View all active collections

4. **Fee System**
   - Trading fee: Configurable from 0.05% to 5%
   - Creator royalty: Configurable from 0% to 5%
   - Maximum total fee: 10%
   - Automated fee distribution to treasury and creators

## Technical Stack

- Solidity ^0.8.0
- OpenZeppelin Contracts (Upgradeable)
- Hardhat Development Environment
- TypeScript for testing and deployment

## Getting Started

1. Clone the repository

```bash
git clone [repository-url]
cd hashkey-nft-market-contract
```

2. Install dependencies

```bash
yarn install
```

3. Set up environment variables

```bash
cp .env.example .env
# Edit .env with your configuration
```

## Development

1. Compile contracts

```bash
yarn compile
```

2. Run tests

```bash
yarn test
```

3. Run local node

```bash
yarn hardhat node
```

4. Deploy contracts

```bash
yarn deploy
```

## Security Features

- Reentrancy Guard implementation
- Access Control system
- Upgradeable proxy pattern
- Whitelist checker integration
- Price manipulation protection
- Front-running protection

## Contract Verification

After deployment, verify your contract:

```bash
yarn verify --network hashkey <contract-address>
```

## Architecture Diagram

```
┌──────────────────┐
│   NFT Market     │
│    (Proxy)       │
└────────┬─────────┘
         │
         │
┌────────┴─────────┐
│  Implementation  │
│    (Logic)       │
└────────┬─────────┘
         │
    ┌────┴────┐
    │ WHSK    │
    │ Token   │
    └─────────┘
```

## Testing

The test suite includes:

- Unit tests for all core functions
- Integration tests for complex scenarios
- Gas optimization tests
- Security vulnerability tests

Run the full test suite:

```bash
yarn test
```

## Gas Optimization

The contracts implement several gas optimization techniques:

- Efficient storage packing
- Minimal storage operations
- Batch processing where applicable
- Optimized loops and data structures

## License

MIT License

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## Support

For questions and support, please:

1. Check existing GitHub issues
2. Create a new issue
3. Refer to the documentation

## Disclaimer

This software is provided "as is", without warranty of any kind. Use at your own risk.
