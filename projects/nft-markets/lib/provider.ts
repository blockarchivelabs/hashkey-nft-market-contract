import { ethers } from "ethers";
import { env } from "./env";

export function getProvider(): ethers.providers.Provider {
  return new ethers.providers.JsonRpcProvider(env("RPC_URL"));
}
