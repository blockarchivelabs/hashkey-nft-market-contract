import "dotenv/config";

export default {
  Admin: {
    hashkey_mainnet: process.env.ADMIN_MAINNET,
    hashkey_testnet: process.env.ADMIN_TESTNET,
  },
  Treasury: {
    hashkey_mainnet: process.env.TREASURY_MAINNET,
    hashkey_testnet: process.env.TREASURY_TESTNET,
  },
  WHSK: {
    hashkey_mainnet: process.env.WHSK_MAINNET,
    hashkey_testnet: process.env.WHSK_TESTNET,
  },
  MinimumAskPrice: {
    hashkey_mainnet: process.env.MINIMUM_ASK_PRICE,
    hashkey_testnet: process.env.MINIMUM_ASK_PRICE,
  },
  MaximumAskPrice: {
    hashkey_mainnet: process.env.MAXIMUM_ASK_PRICE,
    hashkey_testnet: process.env.MAXIMUM_ASK_PRICE,
  },
  hashkey_mainnet: {
    Admin: process.env.ADMIN_MAINNET,
    Treasury: process.env.TREASURY_MAINNET,
    WHSK: process.env.WHSK_MAINNET,
    MinimumAskPrice: process.env.MINIMUM_ASK_PRICE,
    MaximumAskPrice: process.env.MAXIMUM_ASK_PRICE,
    proxy: process.env.PROXY_MAINNET,
    proxyAdmin: process.env.PROXY_ADMIN_MAINNET,
  },
  hashkey_testnet: {
    Admin: process.env.ADMIN_TESTNET,
    Treasury: process.env.TREASURY_TESTNET,
    WHSK: process.env.WHSK_TESTNET,
    MinimumAskPrice: process.env.MINIMUM_ASK_PRICE,
    MaximumAskPrice: process.env.MAXIMUM_ASK_PRICE,
    proxy: process.env.PROXY_TESTNET,
    proxyAdmin: process.env.PROXY_ADMIN_TESTNET,
  },
};
