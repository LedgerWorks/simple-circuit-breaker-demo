/* eslint-disable @typescript-eslint/no-explicit-any */
import { program } from "commander";
import wrapAction from "../wrap-action";
import { getContractForAdmin } from "../../common/ethers-helpers";

export const disable = async () => {
  const contract = getContractForAdmin();
  console.log("Sending transaction");
  const tx = await contract.disable();
  const receipt = await tx.wait();
  if (receipt.status === 0) {
    throw new Error("Transaction failed");
  }
  console.log("Transaction complete");
};

export const register = (): void => {
  program
    .command("disable")
    .description("[admin] Disable the game")
    .action(() => {
      return wrapAction(disable);
    });
};
