import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("HarryNFT", function () {
  async function deployHarryNFTFixture() {
    const HarryNFT = await ethers.getContractFactory("HarryNFT");
    const [owner, addr1, addr2] = await ethers.getSigners();
    const harryNFT = await HarryNFT.deploy();
    await harryNFT.deployed();

    return { HarryNFT, harryNFT, owner, addr1, addr2 };
  }

  /**
  <loadFixture>
  - 성능 최적화
  - 동일한 초기 상태가 필요한 테스트들에 대해 상태를 캐싱
  - 첫 번째 테스트에서만 실제로 실행되고, 이후 테스트는 스냅샷을 재사용
  - 블록체인 상태 관리
  - 각 테스트마다 완전히 동일한 블록체인 상태에서 시작
  - 이전 테스트의 영향을 받지 않음

  <beforeEach>
  - 각 테스트 실행 전에 실행되는 코드
  - 테스트 환경 초기화
  - 테스트 간 종속성 제거
  - 테스트 간 영향 방지
  - 테스트 코드 간결성 향상

  <추천>
  스마트 컨트랙트 테스트에는 loadFixture를 추천:
  1. 성능이 더 좋음 (특히 많은 테스트 케이스가 있을 때)
  2. 테스트 격리가 더 확실함
  Hardhat에 최적화되어 있음
  블록체인 상태 관리가 더 안정적임
  단, 테스트마다 다른 초기 상태가 필요한 경우에는 beforeEach를 사용하는 것이 더 적절할 수 있음
 */

  // beforeEach(async function () {
  //   HarryNFT = await ethers.getContractFactory("HarryNFT");
  //   [owner, addr1, addr2] = await ethers.getSigners();
  //   harryNFT = await HarryNFT.deploy();
  //   await harryNFT.deployed();
  // });

  it("Should set the right owner", async function () {
    const { harryNFT, owner } = await loadFixture(deployHarryNFTFixture);
    expect(await harryNFT.owner()).to.equal(owner.address);
  });

  it("Should mint a new NFT", async function () {
    const { harryNFT, addr1 } = await loadFixture(deployHarryNFTFixture);
    const tokenURI = "https://example.com/token/1";
    await harryNFT.mintNFT(addr1.address, tokenURI, { value: ethers.utils.parseEther("0.001") });
    expect(await harryNFT.balanceOf(addr1.address)).to.equal(1);
  });

  it("Should set the correct base URI", async function () {
    const { harryNFT } = await loadFixture(deployHarryNFTFixture);
    const newBaseURI = "https://newbaseuri.com/";
    await harryNFT.setBaseURI(newBaseURI);
    expect(await harryNFT.baseURI()).to.equal(newBaseURI);
  });

  // Add more tests as needed
});
