import { getPlayerAddress } from "../../../common/env";
import { getContractForPlayer } from "../../../common/ethers-helpers";

export const getCurrentFlipIndex = async (): Promise<number> => {
  return getContractForPlayer().getCurrentFlipIndex(getPlayerAddress());
};
