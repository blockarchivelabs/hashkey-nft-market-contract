import { ethers, network, run } from "hardhat";
import config from "../config";

// Define a type for the network names
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
  console.log("1. Deploying implementation contract...");
  const ERC721NFTMarketV2 = await ethers.getContractFactory("ERC721NFTMarketV2");
  const implementation = await ERC721NFTMarketV2.deploy();
  await implementation.deployed();
  console.log("Implementation contract deployed at:", implementation.address);

  // 2. Deploy ProxyAdmin contract
  console.log("2. Deploying ProxyAdmin contract...");
  const ProxyAdmin = await ethers.getContractFactory("ProxyAdmin");
  const proxyAdmin = await ProxyAdmin.deploy();
  await proxyAdmin.deployed();
  console.log("ProxyAdmin contract deployed at:", proxyAdmin.address);

  // 3. Prepare the encoded data for the initialize function
  console.log("3. Preparing initialization data...");
  console.log("config infos");
  console.log(config.Admin[networkName]);
  console.log(config.Treasury[networkName]);
  console.log(config.WHSK[networkName]);
  console.log(config.MinimumAskPrice[networkName]);
  console.log(config.MaximumAskPrice[networkName]);

  const initData = implementation.interface.encodeFunctionData("initialize", [
    config.Admin[networkName],
    config.Treasury[networkName],
    config.WHSK[networkName],
    config.MinimumAskPrice[networkName],
    config.MaximumAskPrice[networkName],
  ]);
  console.log("Initialization data prepared.");
  console.log("initData", initData);

  // 4. Deploy the proxy contract
  console.log("4. Deploying proxy contract...");
  const NFTMarketProxy = await ethers.getContractFactory("NFTMarketProxy");
  const proxy = await NFTMarketProxy.deploy(implementation.address, proxyAdmin.address, initData);
  await proxy.deployed();
  console.log("Proxy contract deployed at:", proxy.address);

  // 5. Access the implementation contract through the proxy address
  console.log("5. Accessing implementation contract through proxy...");
  const market = await ethers.getContractAt("ERC721NFTMarketV2", proxy.address);
  console.log("Accessed implementation contract at:", market.address);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
