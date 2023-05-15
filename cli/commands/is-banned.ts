import { program } from "commander";
import wrapAction from "../wrap-action";
import { getEnv } from "../../common/env";
import { getContractForAdmin } from "../../common/ethers-helpers";

export const isBanned = async () => {
  const contract = getContractForAdmin();
  const { COINFLIP_PLAYER_ADDRESS } = getEnv();
  const isBanned = await contract.isBanned(COINFLIP_PLAYER_ADDRESS);
  console.log({ isBanned });
};

export const register = (): void => {
  program
    .command("is-banned")
    .description("Returns whether the player is currently banned")
    .action(() => wrapAction(isBanned));
};

export default { register };
