import { program } from "commander";
import wrapAction from "../wrap-action";
import { getContractForAdmin } from "../../common/ethers-helpers";
import { getEnv } from "../../common/env";

export const unban = async () => {
  const contract = getContractForAdmin();
  const { COINFLIP_PLAYER_ADDRESS } = getEnv();
  console.log("Sending transaction");
  const tx = await contract.unban(COINFLIP_PLAYER_ADDRESS);
  const receipt = await tx.wait();
  if (receipt.status === 0) {
    throw new Error("Transaction failed");
  }
  console.log("Transaction complete");
};

export const register = (): void => {
  program
    .command("unban")
    .description("[admin] Unban the player")
    .action(() => wrapAction(unban));
};

export default { register };
