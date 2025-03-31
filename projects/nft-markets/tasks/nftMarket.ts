import { task, types } from "hardhat/config";
import { Contract } from "ethers";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { getProvider } from "../lib/provider";
import { getContract } from "../lib/contract";
import { env } from "../lib/env";
import { getWallet } from "../lib/wallet";

task("get-whsk-address", "Get base URI").setAction(async (_, hre) => {
  return getContract("ERC721NFTMarketV1", hre).then(async (contract: Contract) => {
    console.log("contract.address", await contract.whsk());
  });
});

// add collection
task("add-collection", "Add a collection")
  .addParam("collection", "Collection address", undefined, types.string)
  .addParam("creator", "Creator address", undefined, types.string)
  .addParam("whitelistchecker", "Whitelist checker address", undefined, types.string)
  .addParam("tradingfee", "Trading fee", undefined, types.string)
  .addParam("creatorfee", "Creator fee", undefined, types.string)
  .setAction(async ({ collection, creator, whitelistchecker, tradingfee, creatorfee }, hre) => {
    return getContract("ERC721NFTMarketV1", hre).then(async (contract: Contract) => {
      console.log("contract.address", await contract.address);
      const tx = await contract.addCollection(collection, creator, whitelistchecker, tradingfee, creatorfee, {
        gasLimit: 3_000_000,
      });
      console.log("Transaction:", tx.hash);
      const receipt = await tx.wait();
      console.log("Transaction was mined in block", receipt.blockNumber);
      return receipt;
    });
  });

// List NFT for sale
task("list-nft", "List an NFT for sale")
  .addParam("collection", "NFT Collection address", undefined, types.string)
  .addParam("tokenid", "Token ID", undefined, types.int)
  .addParam("price", "Price in ETH", undefined, types.string)
  .setAction(async ({ collection, tokenid, price }, hre) => {
    return getContract("ERC721NFTMarketV1", hre).then(async (contract: Contract) => {
      console.log("parameters", collection, tokenid, price);
      // get nft-minter contract
      console.log("(Caution!!)Please check approved status");

      console.log(`Listing NFT ${tokenid} from collection ${collection} for ${price} ETH...`);
      const priceInWei = hre.ethers.utils.parseEther(price);
      return contract.createAskOrder(collection, tokenid, priceInWei, {
        gasLimit: 10_000_000,
      });
    });
  });

// Modify listing price
task("modify-nft-price", "Modify NFT sale price")
  .addParam("collection", "NFT Collection address", undefined, types.string)
  .addParam("tokenid", "Token ID", undefined, types.int)
  .addParam("newprice", "New price in ETH", undefined, types.string)
  .setAction(async ({ collection, tokenid, newprice }, hre) => {
    return getContract("ERC721NFTMarketV1", hre).then(async (contract: Contract) => {
      console.log(`Modifying price for NFT ${tokenid} in ${collection} to ${newprice} ETH...`);
      const priceInWei = hre.ethers.utils.parseEther(newprice);
      return contract.modifyAskOrder(collection, tokenid, priceInWei);
    });
  });

// Cancel NFT listing
task("cancel-listing", "Cancel an NFT listing")
  .addParam("collection", "NFT Collection address", undefined, types.string)
  .addParam("tokenid", "Token ID", undefined, types.int)
  .setAction(async ({ collection, tokenid }, hre) => {
    return getContract("ERC721NFTMarketV1", hre).then(async (contract: Contract) => {
      console.log(`Canceling listing for NFT ${tokenid} from collection ${collection}...`);
      return contract.cancelAskOrder(collection, tokenid);
    });
  });

// Buy NFT using HSK
task("buy-nft-hsk", "Buy NFT using HSK")
  .addParam("collection", "NFT Collection address", undefined, types.string)
  .addParam("tokenid", "Token ID", undefined, types.int)
  .setAction(async ({ collection, tokenid }, hre) => {
    return getContract("ERC721NFTMarketV1", hre).then(async (contract: Contract) => {
      const askInfo = await contract.viewAsksByCollectionAndTokenIds(collection, [tokenid]);
      if (!askInfo[0][0]) {
        console.log("NFT is not for sale.");
        return;
      }
      const price = askInfo[1][0].price;
      console.log(`Buying NFT ${tokenid} from ${collection} for ${hre.ethers.utils.formatEther(price)} ETH...`);
      return contract.buyTokenUsingHSK(collection, tokenid, { value: price });
    });
  });

// Buy NFT using whsk
task("buy-nft-whsk", "Buy NFT using whsk")
  .addParam("collection", "NFT Collection address", undefined, types.string)
  .addParam("tokenid", "Token ID", undefined, types.int)
  .setAction(async ({ collection, tokenid }, hre) => {
    return getContract("ERC721NFTMarketV1", hre).then(async (contract: Contract) => {
      const askInfo = await contract.viewAsksByCollectionAndTokenIds(collection, [tokenid]);
      if (!askInfo[0][0]) {
        console.log("NFT is not for sale.");
        return;
      }
      const price = askInfo[1][0].price;
      console.log(`Buying NFT ${tokenid} from ${collection} for ${hre.ethers.utils.formatEther(price)} whsk...`);
      return contract.buyTokenUsingwhsk(collection, tokenid, price);
    });
  });

// View all listed NFTs in a collection
task("view-listings", "View all NFTs for sale in a collection")
  .addParam("collection", "NFT Collection address", undefined, types.string)
  .setAction(async ({ collection }, hre) => {
    return getContract("ERC721NFTMarketV1", hre).then(async (contract: Contract) => {
      const [tokenIds, askInfo] = await contract.viewAsksByCollection(collection, 0, 10);
      console.log(
        "NFTs for sale:",
        tokenIds.map((id: number, index: number) => ({
          tokenId: id,
          price: hre.ethers.utils.formatEther(askInfo[index].price),
        }))
      );
    });
  });

// View listings by a seller
task("view-seller-listings", "View all NFTs a seller has listed in a collection")
  .addParam("collection", "NFT Collection address", undefined, types.string)
  .addParam("seller", "Seller address", undefined, types.string)
  .setAction(async ({ collection, seller }, hre) => {
    return getContract("ERC721NFTMarketV1", hre).then(async (contract: Contract) => {
      const [tokenIds, askInfo] = await contract.viewAsksByCollectionAndSeller(collection, seller, 0, 10);
      console.log(
        "NFTs listed by seller:",
        tokenIds.map((id: number, index: number) => ({
          tokenId: id,
          price: hre.ethers.utils.formatEther(askInfo[index].price),
        }))
      );
    });
  });

// Check if an NFT can be listed
task("can-list-nft", "Check if an NFT can be listed")
  .addParam("collection", "NFT Collection address", undefined, types.string)
  .addParam("tokenid", "Token ID", undefined, types.int)
  .setAction(async ({ collection, tokenid }, hre) => {
    return getContract("ERC721NFTMarketV1", hre).then(async (contract: Contract) => {
      const canList = await contract.canTokensBeListed(collection, [tokenid]);
      console.log(`Can list NFT ${tokenid}:`, canList[0]);
    });
  });

// Claim pending revenue
task("claim-revenue", "Claim pending revenue from sales").setAction(async (_, hre) => {
  return getContract("ERC721NFTMarketV1", hre).then(async (contract: Contract) => {
    console.log("Claiming pending revenue...");
    return contract.claimPendingRevenue();
  });
});

task("get-pending-revenue", "Get pending revenue")
  .addParam("address", "Address", undefined, types.string)
  .setAction(async ({ address }, hre) => {
    return getContract("ERC721NFTMarketV1", hre).then(async (contract: Contract) => {
      console.log("Pending revenue:", await contract.pendingRevenue(address));
    });
  });

task("close-collection", "Close a collection")
  .addParam("collection", "NFT Collection address", undefined, types.string)
  .setAction(async ({ collection }, hre) => {
    return getContract("ERC721NFTMarketV1", hre).then(async (contract: Contract) => {
      console.log("Closing collection...");
      const tx = await contract.closeCollectionForTradingAndListing(collection);
      console.log("tx", tx);
    });
  });
