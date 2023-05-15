import { program } from "commander";
import wrapAction from "../wrap-action";
import { getContractForPlayer } from "../../common/ethers-helpers";

export const flip = async (timestamp: number) => {
  const contract = getContractForPlayer();
  console.log("Sending transaction");
  const tx = await contract.flip(timestamp);
  const receipt = await tx.wait();
  if (receipt.status === 0) {
    throw new Error("Transaction failed");
  }
  console.log("Transaction complete");
};

export const register = (): void => {
  program
    .command("flip")
    .description("Initiate a coin flip")
    .argument("<number>", "The current timestamp")
    .action((timestamp: number) => {
      return wrapAction(flip, timestamp);
    });
};

export default { register };
