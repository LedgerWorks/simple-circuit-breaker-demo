import dotenv from "dotenv";

export type Env = {
  RPC_HOST: string;
  COINFLIP_CONTRACT_ADDRESS: string;
  COINFLIP_ADMIN_ADDRESS: string;
  COINFLIP_ADMIN_KEY: string;
  COINFLIP_PLAYER_ADDRESS: string;
  COINFLIP_PLAYER_KEY: string;
};

export const chainId = 43113;

export const getRequired = (key: string): string => {
  const value = `${process.env[key]}`;
  if (!value) {
    throw new Error(`No ${key} configured on the environment.`);
  }
  return value;
};

let env: Env | undefined;
export const getEnv = (): Env => {
  if (!env) {
    dotenv.config();
    env = {
      RPC_HOST: getRequired("RPC_HOST"),
      COINFLIP_CONTRACT_ADDRESS: getRequired("COINFLIP_CONTRACT_ADDRESS"),
      COINFLIP_ADMIN_ADDRESS: getRequired("COINFLIP_ADMIN_ADDRESS"),
      COINFLIP_ADMIN_KEY: getRequired("COINFLIP_ADMIN_KEY"),
      COINFLIP_PLAYER_ADDRESS: getRequired("COINFLIP_PLAYER_ADDRESS"),
      COINFLIP_PLAYER_KEY: getRequired("COINFLIP_PLAYER_KEY"),
    };
  }
  return env;
};
