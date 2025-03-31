import { ethers, run } from "hardhat";

async function main() {
  // Compile contracts
  await run("compile");
  console.log("Compiled contracts.");

  // Deploy HarryNFT contract
  const HarryNFT = await ethers.getContractFactory("HarryNFT");
  const harryNFT = await HarryNFT.deploy();
  await harryNFT.deployed();

  console.log(`HarryNFT deployed to ${harryNFT.address}`);

  // Deploy Lock contract
  // const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  // const unlockTime = currentTimestampInSeconds + 60;
  // const lockedAmount = ethers.utils.parseEther("0.001");

  // const Lock = await ethers.getContractFactory("Lock");
  // const lock = await Lock.deploy(unlockTime, { value: lockedAmount });
  // await lock.deployed();

  // console.log(
  //   `Lock with ${ethers.utils.formatEther(lockedAmount)}ETH and unlock timestamp ${unlockTime} deployed to ${
  //     lock.address
  //   }`
  // );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
