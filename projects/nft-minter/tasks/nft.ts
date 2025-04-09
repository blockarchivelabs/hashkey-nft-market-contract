import { task, types } from "hardhat/config";
import { Contract } from "ethers";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { env } from "../lib/env";
import { getContract } from "../lib/contract";
import { getWallet } from "../lib/wallet";

task("approve", "Approve NFT")
  .addParam("tokenid", "Token ID", undefined, types.int)
  .addParam("target", "Target address", undefined, types.string)
  .setAction(async ({ tokenid, target }, hre) => {
    return getContract("HarryNFT", hre).then((contract: Contract) => {
      return contract.approve(target, tokenid, {
        gasLimit: 3_500_000,
      });
    });
  });

task("transfer-nft", "Transfer NFT")
  .addParam("tokenid", "Token ID", undefined, types.int)
  .addParam("to", "To address", undefined, types.string)
  .setAction(async ({ tokenid, to }, hre) => {
    return getContract("HarryNFT", hre).then((contract: Contract) => {
      console.log("contract.address", contract.address);
      console.log("tokenid", tokenid);
      console.log("to", to);
      // 0x26AC28D33EcBf947951d6B7d8a1e6569eE73d076
      return contract.transferFrom(env("DEPLOYER_ADDRESS"), to, tokenid);
    });
  });

task("transfer-nft-by-name", "Transfer NFT by name")
  .addParam("name", "Contract name", undefined, types.string)
  .addParam("tokenid", "Token ID", undefined, types.int)
  .addParam("to", "To address", undefined, types.string)
  .setAction(async ({ name, tokenid, to }, hre) => {
    return getContract(name, hre).then((contract: Contract) => {
      console.log("contract.address", contract.address);
      console.log("tokenid", tokenid);
      console.log("to", to);
      // 0x26AC28D33EcBf947951d6B7d8a1e6569eE73d076
      return contract.transferFrom(env("DEPLOYER_ADDRESS"), to, tokenid);
    });
  });

task("deploy-contract", "Deploy NFT contract").setAction(async (_, hre) => {
  return hre.ethers
    .getContractFactory("NyangNFT", getWallet())
    .then((contractFactory) => contractFactory.deploy())
    .then(async (result) => {
      // console deployer
      console.log("deployer", getWallet());
      // console balance
      console.log("balance", await getWallet().getBalance());
      process.stdout.write(`Contract address: ${result.address}`);
    })
    .catch((error) => {
      console.error(error);
    });
});

task("deploy-contract-by-name", "Deploy NFT contract by name")
  .addParam("name", "Contract name", undefined, types.string)
  .setAction(async ({ name }, hre) => {
    return hre.ethers
      .getContractFactory(name, getWallet())
      .then((contractFactory: any) => contractFactory.deploy())
      .then(async (result) => {
        // console deployer
        console.log("deployer", getWallet());
        // console balance
        console.log("balance", await getWallet().getBalance());
        process.stdout.write(`Contract address: ${result.address}`);
      })
      .catch((error) => {
        console.error(error);
      });
  });

task("set-base-uri", "Set base URI")
  .addParam("newbaseuri", "New base URI", undefined, types.string)
  .setAction(async ({ newbaseuri }, hre) => {
    return getContract("NyangNFT", hre).then((contract: Contract) => {
      console.log("contract.address", contract.address);
      console.log("newbaseuri", newbaseuri);
      return contract.setBaseURI(newbaseuri, {
        gasLimit: 3_500_000,
      });
    });
  });

task("get-base-uri", "Get base URI").setAction(async (_, hre) => {
  return getContract("NyangNFT", hre).then(async (contract: Contract) => {
    const baseURI = await contract.baseURI();
    console.log("baseURI", baseURI);
    return baseURI;
  });
});

task("mint-nft", "Mint an NFT")
  .addParam("tokenuri", "Your ERC721 Token URI", undefined, types.string)
  .setAction(async (tokenUri, hre) => {
    return getContract("NyangNFT", hre)
      .then((contract: Contract) => {
        console.log("contract.address", contract.address);
        console.log("tokenUri", tokenUri);
        console.log("Minter Address", env("DEPLOYER_ADDRESS"));
        return contract.mintNFT(env("DEPLOYER_ADDRESS"), tokenUri, {
          gasLimit: 500_000,
          value: hre.ethers.utils.parseEther("0.001"),
        });
      })
      .then((tr: TransactionResponse) => {
        process.stdout.write(`TX hash: ${tr.hash}`);
      });
  });

task("mint-nft-by-name", "Mint an NFT by name")
  .addParam("name", "Contract name", undefined, types.string)
  .addParam("tokenuri", "Your ERC721 Token URI", undefined, types.string)
  .setAction(async ({ name, tokenuri }, hre) => {
    return getContract(name, hre)
      .then((contract: Contract) => {
        console.log("contract.address", contract.address);
        console.log("tokenUri", tokenuri);
        console.log("Minter Address", env("DEPLOYER_ADDRESS"));
        return contract.mintNFT(env("DEPLOYER_ADDRESS"), tokenuri, {
          gasLimit: 500_000,
          value: hre.ethers.utils.parseEther("0.001"),
        });
      })
      .then((tr: TransactionResponse) => {
        process.stdout.write(`TX hash: ${tr.hash}`);
      });
  });

task("set-mint-price", "Set mint price")
  .addParam("price", "New mint price(Input ETH)", undefined, types.string)
  .setAction(async ({ price }, hre) => {
    return getContract("HarryNFT", hre).then((contract: Contract) => {
      console.log("input price", price);
      console.log(
        "input price hre.ethers.utils.parseEther(price.toString())",
        hre.ethers.utils.parseEther(price.toString())
      );
      const priceInWei = hre.ethers.utils.parseEther(price.toString());
      console.log("priceInWei", priceInWei);
      console.log("priceInWei.toString()", hre.ethers.utils.formatEther(priceInWei), "ETH");

      return contract.setMintPrice(priceInWei);
    });
  });

task("get-mint-price", "Get mint price").setAction(async (_, hre) => {
  return getContract("HarryNFT", hre).then(async (contract: Contract) => {
    console.log("contract.address", contract.address);

    const price = await contract.MINT_PRICE();
    console.log("price.toString()", hre.ethers.utils.formatEther(price));
  });
});

task("collect-ether", "Collect ether").setAction(async (_, hre) => {
  return getContract("HarryNFT", hre).then((contract: Contract) => {
    return contract.collectEther();
  });
});

task("transfer-ownership", "Transfer ownership").setAction(async (_, hre) => {
  return getContract("HarryNFT", hre).then((contract: Contract) => {
    return contract.transferOwnership(env("DEPLOYER_ADDRESS"));
  });
});

task("get-owner", "Get owner").setAction(async (_, hre) => {
  return getContract("HarryNFT", hre).then((contract: Contract) => {
    return contract.owner();
  });
});

task("get-balance", "Get balance").setAction(async (_, hre) => {
  return getContract("HarryNFT", hre).then((contract: Contract) => {
    return contract.balanceOf(env("DEPLOYER_ADDRESS"));
  });
});

task("get-total-supply", "Get total supply").setAction(async (_, hre) => {
  return getContract("HarryNFT", hre).then((contract: Contract) => {
    return contract.totalSupply();
  });
});

task("get-token-uri", "Get token uri")
  .addParam("tokenid", "Token ID", undefined, types.int)
  .setAction(async ({ tokenid }, hre) => {
    return getContract("HarryNFT", hre).then(async (contract: Contract) => {
      console.log("contract.address", contract.address);
      const tokenUri = await contract.tokenURI(tokenid);
      console.log("contract.tokenURI(1)", tokenUri);
      console.log("tokenUri.toString()", tokenUri.toString());

      return tokenUri;
    });
  });
