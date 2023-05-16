import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

function getPrivateKey(): string {
  const key = process.env.COINFLIP_ADMIN_KEY;
  if (!key) {
    throw new Error("The COINFLIP_ADMIN_KEY environment variable must be set");
  }
  return process.env.COINFLIP_ADMIN_KEY as string;
}

const config: HardhatUserConfig = {
  solidity: {
    compilers: [{ version: "0.8.17" }, { version: "0.7.6" }],
  },
  paths: {
    sources: "./contracts",
    tests: "./contracts",
    cache: "./hardhat-cache",
    artifacts: "./dist/hardhat-artifacts",
  },
  networks: {
    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      gasPrice: 225000000000,
      chainId: 43113,
      accounts: [getPrivateKey()],
    },
  },
};

export default config;
