import { getPlayerAddress } from "../../../common/env";
import { getContractForAdmin } from "../../../common/ethers-helpers";

export const incrementCurrentFlip = async (): Promise<void> => {
  const tx = await getContractForAdmin().incrementCurrentFlip(getPlayerAddress());
  const receipt = tx.wait();
  if (receipt.status === 0) {
    throw new Error("Transaction failed");
  }
};
