import { ethers, network, run } from "hardhat";
import config from "../config";

const main = async () => {
  // Get network name: hardhat, testnet or mainnet.
  const networkName = network.name;
  console.log(`Deploying to ${networkName} network...`);

  // Get deployer address
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying with ${deployer.address}`);

  // 1. Deploy implementation contract
  const ERC721NFTMarketV2 = await ethers.getContractFactory("ERC721NFTMarketV2");
  const implementation = await ERC721NFTMarketV2.deploy();
  await implementation.deployed();
  console.log("NFTMarketV2 Implementation deployed to:", implementation.address);

  // 2. Deploy ProxyAdmin contract
  const ProxyAdmin = await ethers.getContractFactory("NFTMarketProxyAdmin");
  const proxyAdmin = await ProxyAdmin.deploy();
  await proxyAdmin.deployed();
  console.log("ProxyAdmin deployed to:", proxyAdmin.address);

  // 3. Prepare initialization data
  const initData = implementation.interface.encodeFunctionData("initialize", [
    config[networkName].Admin,
    config[networkName].Treasury,
    config[networkName].WHSK,
    config[networkName].MinimumAskPrice,
    config[networkName].MaximumAskPrice,
  ]);

  console.log("Initialization data:", initData);

  // 4. Deploy Proxy contract
  const Proxy = await ethers.getContractFactory("NFTMarketProxy");
  const proxy = await Proxy.deploy(implementation.address, proxyAdmin.address, initData);
  await proxy.deployed();
  console.log("Proxy deployed to:", proxy.address);

  console.log("\nDeployment completed!");
  console.log("Please update the following addresses in config.ts:");
  console.log("proxy:", proxy.address);
  console.log("proxyAdmin:", proxyAdmin.address);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
