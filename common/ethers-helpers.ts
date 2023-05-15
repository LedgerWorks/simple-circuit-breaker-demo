import Avalanche from "avalanche";
import { EVMAPI } from "avalanche/dist/apis/evm";
import { Contract, ethers, Wallet } from "ethers";
import { JsonRpcProvider } from "@ethersproject/providers";

import abi from "./abi";
import { chainId, getEnv } from "./env";

const {
  RPC_HOST,
  COINFLIP_CONTRACT_ADDRESS,
  COINFLIP_ADMIN_KEY,
  COINFLIP_PLAYER_KEY,
} = getEnv();

let provider: JsonRpcProvider | undefined;
export const getProvider = (): JsonRpcProvider => {
  if (!provider) {
    provider = new ethers.providers.JsonRpcProvider(`https://${RPC_HOST}/ext/bc/C/rpc`);
  }
  return provider;
};

let adminWallet: Wallet | undefined;
export const getAdminWallet = (): Wallet => {
  if (!adminWallet) {
    adminWallet = new Wallet(COINFLIP_ADMIN_KEY, getProvider());
  }
  return adminWallet;
};

let playerWallet: Wallet | undefined;
export const getPlayerWallet = (): Wallet => {
  if (!playerWallet) {
    playerWallet = new Wallet(COINFLIP_PLAYER_KEY, getProvider());
  }
  return playerWallet;
};

let contractForAdmin: Contract | undefined;
export const getContractForAdmin = (): Contract => {
  if (!contractForAdmin) {
    contractForAdmin = new Contract(COINFLIP_CONTRACT_ADDRESS, abi, getAdminWallet());
  }
  return contractForAdmin;
};

let contractForPlayer: Contract | undefined;
export const getContractForPlayer = (): Contract => {
  if (!contractForPlayer) {
    contractForPlayer = new Contract(COINFLIP_CONTRACT_ADDRESS, abi, getPlayerWallet());
  }
  return contractForPlayer;
};

let avalancheCChain: EVMAPI | undefined;
export const getAvalancheCChain = (): EVMAPI => {
  if (!avalancheCChain) {
    avalancheCChain = new Avalanche(RPC_HOST, undefined, "https", chainId).CChain();
  }
  return avalancheCChain;
};
