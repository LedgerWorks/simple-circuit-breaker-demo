/* eslint-disable @typescript-eslint/no-explicit-any */
import { program } from "commander";
import wrapAction from "../wrap-action";
import { getContractForAdmin } from "../../common/ethers-helpers";

export const enable = async () => {
  const contract = getContractForAdmin();
  console.log("Sending transaction");
  const tx = await contract.enable();
  const receipt = await tx.wait();
  if (receipt.status === 0) {
    throw new Error("Transaction failed");
  }
  console.log("Transaction complete");
};

export const register = (): void => {
  program
    .command("enable")
    .description("[admin] Enable the game")
    .action(() => {
      return wrapAction(enable);
    });
};
