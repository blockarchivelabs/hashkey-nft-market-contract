import { ethers, network, run } from "hardhat";
import config from "../config";

const main = async () => {
  // Get network name: hardhat, testnet or mainnet.
  const networkName = network.name;
  console.log(`Deploying to ${networkName} network...`);

  // Get deployer address
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying with ${deployer.address}`);

  // Compile contracts.
  await run("compile");
  console.log("Compiled contracts.");

  // Deploy contract
  const ERC721NFTMarketV1 = await ethers.getContractFactory("ERC721NFTMarketV1");

  console.log("========================================");
  console.log(config.Admin[networkName]);
  console.log(config.Treasury[networkName]);
  console.log(config.WHSK[networkName]);
  console.log(config.MinimumAskPrice[networkName]);
  console.log(config.MaximumAskPrice[networkName]);
  console.log("========================================");

  const contract = await ERC721NFTMarketV1.deploy(
    config.Admin[networkName],
    config.Treasury[networkName],
    config.WHSK[networkName],
    config.MinimumAskPrice[networkName],
    config.MaximumAskPrice[networkName]
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
