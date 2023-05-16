import { ethers } from "ethers";
import { getContractForPlayer } from "../../../common/ethers-helpers";
import { Side } from "../../../common/types";

export const flip = async (side: Side, wager: number, timestamp: number): Promise<void> => {
  const tx = await getContractForPlayer().flip(side, timestamp, {
    value: ethers.utils.parseUnits(`${wager}`),
    // gasLimit: 1000000,
  });
  const receipt = tx.wait();
  if (receipt.status === 0) {
    throw new Error("Transaction failed");
  }
};
