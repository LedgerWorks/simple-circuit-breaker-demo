import dotenv from "dotenv";

dotenv.config();

export const getRequired = (key: string): string => {
  const value = `${process.env[key]}`;
  if (!value) {
    throw new Error(`No ${key} configured on the environment.`);
  }
  return value;
};

export const getOptional = (key: string, defaultValue?: string): string | undefined => {
  const value = `${process.env[key]}`;
  return value ?? defaultValue;
};

export const getChainId = (): number => parseInt(getRequired("CHAIN_ID"), 10);
export const getRpcHost = (): string => getRequired("RPC_HOST");
export const getContractAddress = (): string => getRequired("COINFLIP_CONTRACT_ADDRESS");
export const getAdminAddress = (): string => getRequired("COINFLIP_ADMIN_ADDRESS");
export const getAdminKey = (): string => getRequired("COINFLIP_ADMIN_KEY");
export const getPlayerAddress = (): string => getRequired("COINFLIP_PLAYER_ADDRESS");
export const getPlayerKey = (): string => getRequired("COINFLIP_PLAYER_KEY");
