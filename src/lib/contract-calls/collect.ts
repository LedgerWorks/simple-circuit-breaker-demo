import { getContractForPlayer } from "../../../common/ethers-helpers";

export const collect = async (): Promise<void> => {
  const tx = await getContractForPlayer().collect();
  const receipt = tx.wait();
  if (receipt.status === 0) {
    throw new Error("Transaction failed");
  }
};
