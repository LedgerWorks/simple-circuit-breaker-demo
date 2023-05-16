import { getPlayerAddress } from "../../../common/env";
import { getContractForPlayer } from "../../../common/ethers-helpers";
import { Flip } from "../../../common/types";
import { map } from "../mappers";

export const getCurrentFlip = async (): Promise<Flip> => {
  const rawFlip = await getContractForPlayer().getCurrentFlip(getPlayerAddress());
  return map<Flip>(rawFlip);
};
