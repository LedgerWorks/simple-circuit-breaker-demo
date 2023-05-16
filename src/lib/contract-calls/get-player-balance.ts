import { BigNumber } from "ethers";
import { getProvider } from "../../../common/ethers-helpers";
import { getPlayerAddress } from "../../../common/env";

export const getPlayerBalance = async (): Promise<BigNumber> => {
  return getProvider().getBalance(getPlayerAddress());
};
