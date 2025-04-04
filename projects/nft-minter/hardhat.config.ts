/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import type { HardhatUserConfig, NetworkUserConfig } from "hardhat/types";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@openzeppelin/hardhat-upgrades";
import "@typechain/hardhat";
import "hardhat-abi-exporter";
import "hardhat-contract-sizer";
import "solidity-coverage";
import "solidity-docgen";
import "dotenv/config";

require("dotenv").config({ path: require("find-config")(".env") });
require("./tasks/nft");

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    hashkey_mainnet: {
      url: "https://mainnet.hsk.xyz",
      chainId: 177,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY!],
    },
    hashkey_testnet: {
      url: "https://hashkeychain-testnet.alt.technology",
      chainId: 133,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY!],
    },
    kairos: {
      chainId: 1001,
      url: "https://public-en-kairos.node.kaia.io",
      gasPrice: 25000000000,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY!],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
    customChains: [
      {
        network: "hashkey_mainnet",
        chainId: 177,
        urls: {
          apiURL: "https://explorer.hsk.xyz:443/api",
          browserURL: "https://explorer.hsk.xyz:443",
        },
      },
      {
        network: "hashkey_testnet",
        chainId: 133,
        urls: {
          apiURL: "https://hashkeychain-testnet-explorer.alt.technology:443/api",
          browserURL: "https://hashkeychain-testnet-explorer.alt.technology:443",
        },
      },
    ],
  },
  solidity: {
    compilers: [
      {
        version: "0.8.10",
        settings: {
          optimizer: {
            enabled: true,
            runs: 999,
          },
        },
      },
      {
        version: "0.7.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 999,
          },
        },
      },
      {
        version: "0.4.18",
        settings: {
          optimizer: {
            enabled: true,
            runs: 999,
          },
        },
      },
    ],
  },
  paths: {
    sources: "./contracts/",
    tests: "./test",
    cache: "./cache",
    lib: "./lib",
    artifacts: "./artifacts",
  },
  docgen: {
    pages: "files",
  },
};

export default config;
