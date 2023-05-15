import { program } from "commander";
import wrapAction from "../wrap-action";
import { getEnv } from "../../common/env";
import { getContractForAdmin } from "../../common/ethers-helpers";

export const ban = async () => {
  const contract = getContractForAdmin();
  const { COINFLIP_PLAYER_ADDRESS } = getEnv();
  console.log("Sending transaction");
  const tx = await contract.ban(COINFLIP_PLAYER_ADDRESS);
  const receipt = await tx.wait();
  if (receipt.status === 0) {
    throw new Error("Transaction failed");
  }
  console.log("Transaction complete");
};

export const register = (): void => {
  program
    .command("ban")
    .description("[admin] Ban the player")
    .action(() => wrapAction(ban));
};

export default { register };
