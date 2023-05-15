/* eslint-disable @typescript-eslint/no-explicit-any */
import { ethers, BigNumber } from "ethers";
import { program } from "commander";
import wrapAction from "../wrap-action";
import { getContractForPlayer } from "../../common/ethers-helpers";

export const wager = async (calledSide: number, amount: BigNumber) => {
  const contract = getContractForPlayer();
  console.log("Sending transaction");
  const tx = await contract.wager(calledSide, { value: amount });
  const receipt = await tx.wait();
  if (receipt.status === 0) {
    throw new Error("Transaction failed");
  }
  console.log("Transaction complete");
};

export const register = (): void => {
  program
    .command("wager")
    .description("Place a wager on a coin flip")
    .argument("<number>", "The called side (Heads = 1, Tails = 2)")
    .argument("<number>", "The amount of AVAX to wager (must be between 0.01 and 1)")
    .action((calledSide: number, amount: string) => {
      return wrapAction(wager, calledSide, ethers.utils.parseEther(amount));
    });
};

export default { register };
