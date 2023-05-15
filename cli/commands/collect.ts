import { program } from "commander";
import wrapAction from "../wrap-action";
import { getContractForPlayer } from "../../common/ethers-helpers";

export const collect = async () => {
  const contract = getContractForPlayer();
  console.log("Sending transaction");
  const tx = await contract.collect();
  const receipt = await tx.wait();
  if (receipt.status === 0) {
    throw new Error("Transaction failed");
  }
  console.log("Transaction complete");
};

export const register = (): void => {
  program
    .command("collect")
    .description("Collect the payout from a successful coin flip.")
    .action(() => wrapAction(collect));
};

export default { register };
