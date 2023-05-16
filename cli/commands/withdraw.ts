import { ethers, BigNumber } from "ethers";
import { program } from "commander";
import wrapAction from "../wrap-action";
import { getContractForAdmin } from "../../common/ethers-helpers";

export const withdraw = async (amount: BigNumber) => {
  const contract = getContractForAdmin();
  console.log("Sending transaction");
  const tx = await contract.withdraw(amount);
  const receipt = await tx.wait();
  if (receipt.status === 0) {
    throw new Error("Transaction failed");
  }
  console.log("Transaction complete");
};

export const register = (): void => {
  program
    .command("withdraw")
    .description("[admin] Withdraw AVAX from the CoinFlip contract")
    .argument("<amount>", "The amount of AVAX to withdraw")
    .action((amount: string) => wrapAction(withdraw, ethers.utils.parseEther(amount)));
};
