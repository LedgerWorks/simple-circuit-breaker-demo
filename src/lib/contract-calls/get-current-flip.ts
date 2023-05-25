import { getPlayerAddress } from "../../../common/env";
import { getContractForPlayer } from "../../../common/ethers-helpers";
import { Flip } from "../../../common/types";

export const getCurrentFlip = async (): Promise<Flip> => {
  const rawFlip = await getContractForPlayer().getCurrentFlip(getPlayerAddress());
  return Object.fromEntries(Object.entries(rawFlip)) as Flip;
};
