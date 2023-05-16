import { getPlayerAddress } from "../../../common/env";
import { getContractForPlayer } from "../../../common/ethers-helpers";
import { Flip } from "../../../common/types";

export const getFlip = async (flipIndex: number): Promise<Flip> => {
  return getContractForPlayer().getFlip(getPlayerAddress(), flipIndex);
};
