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
  // 1. 새로운 구현 컨트랙트를 배포합니다
  const ERC721NFTMarketV3 = await ethers.getContractFactory("ERC721NFTMarketV3");
  const newImplementation = await ERC721NFTMarketV3.deploy();
  await newImplementation.deployed();

  // 2. ProxyAdmin 컨트랙트 인스턴스를 가져옵니다
  const proxyAdmin = await ethers.getContractAt("ProxyAdmin", config[networkName].proxyAdmin);
  const proxy = await ethers.getContractAt("NFTMarketProxy", config[networkName].proxy);

  // 3. ProxyAdmin을 통해 업그레이드를 실행합니다
  await proxyAdmin.upgrade(proxy.address, newImplementation.address);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
