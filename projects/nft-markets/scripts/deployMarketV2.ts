import { ethers, network, run } from "hardhat";
import config from "../config";

type NetworkName = "hashkey_mainnet" | "hashkey_testnet";

const main = async () => {
  // Get network name: hardhat, testnet or mainnet.
  const networkName = network.name as NetworkName;
  console.log(`Deploying to ${networkName} network...`);

  // Get deployer address
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying with ${deployer.address}`);

  // Compile contracts.
  await run("compile");
  console.log("Compiled contracts.");

  // Deploy contract
  const ERC721NFTMarketV2 = await ethers.getContractFactory("ERC721NFTMarketV2");

  console.log("========================================");
  console.log(config.Admin[networkName]);
  console.log(config.Treasury[networkName]);
  console.log(config.WHSK[networkName]);
  console.log(config.MinimumAskPrice[networkName]);
  console.log(config.MaximumAskPrice[networkName]);
  console.log("========================================");

  const contract = await ERC721NFTMarketV2.deploy();

  // Initialize the contract
  await contract.initialize(
    config.Admin[networkName],
    config.Treasury[networkName],
    config.WHSK[networkName],
    config.MinimumAskPrice[networkName],
    config.MaximumAskPrice[networkName],
    {
      gasLimit: 10000000,
    }
  );

  // Wait for the contract to be deployed before exiting the script.
  await contract.deployed();
  console.log(`Deployed to ${contract.address}`);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
