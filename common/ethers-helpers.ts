import Avalanche from "avalanche";
import { EVMAPI } from "avalanche/dist/apis/evm";
import { Contract, ethers, Wallet } from "ethers";
import { JsonRpcProvider } from "@ethersproject/providers";

import abi from "./abi";
import { getAdminKey, getChainId, getContractAddress, getPlayerKey, getRpcHost } from "./env";

let provider: JsonRpcProvider | undefined;
export const getProvider = (): JsonRpcProvider => {
  if (!provider) {
    const host = getRpcHost();
    provider = new ethers.providers.JsonRpcProvider(`https://${host}/ext/bc/C/rpc`);
  }
  return provider;
};

let adminWallet: Wallet | undefined;
export const getAdminWallet = (): Wallet => {
  if (!adminWallet) {
    const key = getAdminKey();
    adminWallet = new Wallet(key, getProvider());
  }
  return adminWallet;
};

let playerWallet: Wallet | undefined;
export const getPlayerWallet = (): Wallet => {
  if (!playerWallet) {
    const key = getPlayerKey();
    playerWallet = new Wallet(key, getProvider());
  }
  return playerWallet;
};

let contractForAdmin: Contract | undefined;
export const getContractForAdmin = (): Contract => {
  if (!contractForAdmin) {
    const address = getContractAddress();
    const wallet = getAdminWallet();
    contractForAdmin = new Contract(address, abi, wallet);
  }
  return contractForAdmin;
};

let contractForPlayer: Contract | undefined;
export const getContractForPlayer = (): Contract => {
  if (!contractForPlayer) {
    const address = getContractAddress();
    const wallet = getPlayerWallet();
    contractForPlayer = new Contract(address, abi, wallet);
  }
  return contractForPlayer;
};

let avalancheCChain: EVMAPI | undefined;
export const getAvalancheCChain = (): EVMAPI => {
  if (!avalancheCChain) {
    const host = getRpcHost();
    const chainId = getChainId();
    avalancheCChain = new Avalanche(host, undefined, "https", chainId).CChain();
  }
  return avalancheCChain;
};
