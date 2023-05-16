/* eslint-disable @typescript-eslint/no-explicit-any */
import { ethers, BigNumber } from "ethers";
import { program } from "commander";
import wrapAction from "../wrap-action";
import { getContractForPlayer } from "../../common/ethers-helpers";
import { getPlayerAddress } from "../../common/env";

const getFlipStatus = (flip: any) => {
  if (flip.status === 1) return "Loser";
  if (flip.status === 2) return "Winner";
  return "Result unknown";
};

export const flip = async (calledSide: number, amount: BigNumber, timestamp: number) => {
  const contract = getContractForPlayer();
  const playerAddress = getPlayerAddress();
  const flipIndex = await contract.getCurrentFlipIndex(playerAddress);
  console.log("Sending transaction");
  const tx = await contract.flip(calledSide, timestamp, { value: amount });
  const receipt = await tx.wait();
  if (receipt.status === 0) {
    throw new Error("Transaction failed");
  }
  console.log("Transaction complete");
  const currentFlip = await contract.getFlip(playerAddress, flipIndex);
  const flipStatus = getFlipStatus(currentFlip);
  console.log({ flipStatus });
};

export const register = (): void => {
  program
    .command("flip")
    .description("Place a wager on a coin flip")
    .argument("<number>", "The called side (Heads = 1, Tails = 2)")
    .argument("<number>", "The amount of AVAX to wager (must be between 0.01 and 1)")
    .argument("<number>", "The current timestamp")
    .action((calledSide: number, amount: string, timestamp: number) => {
      return wrapAction(flip, calledSide, ethers.utils.parseEther(amount), timestamp);
    });
};
