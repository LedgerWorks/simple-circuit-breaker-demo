import { program } from "commander";
import wrapAction from "../wrap-action";
import { getContractForAdmin } from "../../common/ethers-helpers";
import { getEnv } from "../../common/env";

export const isWinner = async () => {
  const contract = getContractForAdmin();
  const { COINFLIP_PLAYER_ADDRESS } = getEnv();
  const isWinner = await contract.isWinner(COINFLIP_PLAYER_ADDRESS);
  console.log({ isWinner });
};

export const register = (): void => {
  program
    .command("is-winner")
    .description("Returns whether the player is currently a winner")
    .action(() => wrapAction(isWinner));
};

export default { register };
