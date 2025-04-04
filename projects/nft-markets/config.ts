export default {
  Admin: {
    // TODO: needs to be updated before deployment
    hashkey_mainnet: "0x708D369b91948E9812821c9BD4664ce0CcDFAB07",
    hashkey_testnet: "0x2a6798EE6Df87C66f35b4ef54A4ec66912Bd51cb",
  },
  Treasury: {
    // TODO: needs to be updated before deployment
    hashkey_mainnet: "0x708D369b91948E9812821c9BD4664ce0CcDFAB07",
    hashkey_testnet: "0x2a6798EE6Df87C66f35b4ef54A4ec66912Bd51cb",
  },
  WHSK: {
    hashkey_mainnet: "0xB210D2120d57b758EE163cFfb43e73728c471Cf1",
    hashkey_testnet: "0xA0F15E49C19648D49769920cFD58d47b18F52be8",
  },
  MinimumAskPrice: {
    // in wei
    hashkey_mainnet: "10000000000000000", // 0.01 BNB
    hashkey_testnet: "10000000000000000", // 0.01 BNB
  },
  MaximumAskPrice: {
    // in wei
    hashkey_mainnet: "100000000000000000000000000", // 100,000,000 BNB
    hashkey_testnet: "100000000000000000000000000", // 100,000,000 BNB
  },
  hashkey_mainnet: {
    Admin: "0x708D369b91948E9812821c9BD4664ce0CcDFAB07",
    Treasury: "0x708D369b91948E9812821c9BD4664ce0CcDFAB07",
    WHSK: "0xB210D2120d57b758EE163cFfb43e73728c471Cf1",
    MinimumAskPrice: "10000000000000000",
    MaximumAskPrice: "100000000000000000000000000",
    proxy: "YOUR_PROXY_ADDRESS_HERE",
    proxyAdmin: "YOUR_PROXY_ADMIN_ADDRESS_HERE",
  },
  hashkey_testnet: {
    Admin: "0x2a6798EE6Df87C66f35b4ef54A4ec66912Bd51cb",
    Treasury: "0x2a6798EE6Df87C66f35b4ef54A4ec66912Bd51cb",
    WHSK: "0xA0F15E49C19648D49769920cFD58d47b18F52be8",
    MinimumAskPrice: "10000000000000000",
    MaximumAskPrice: "100000000000000000000000000",
    proxy: "0x75f4Bd4077439424E11771C07dc4C2597A214Cc1",
    proxyAdmin: "0x4455A01d4E17399CDfB6F91E8b9cE389774f916e",
  },
};
