import { program } from "commander";
import wrapAction from "../wrap-action";
import { getEnv } from "../../common/env";
import { getContractForAdmin } from "../../common/ethers-helpers";

export const getFlip = async (index: number) => {
  const contract = getContractForAdmin();
  const { COINFLIP_PLAYER_ADDRESS } = getEnv();
  const flipIndex =
    index < 0 || Number.isNaN(index)
      ? (await contract.getCurrentFlipIndex(COINFLIP_PLAYER_ADDRESS)).toNumber()
      : index;
  const flip = await contract.getFlip(COINFLIP_PLAYER_ADDRESS, flipIndex);
  console.log({ flipIndex, ...flip });
};

export const register = (): void => {
  program
    .command("get-flip")
    .description("Gets a flip")
    .argument("[number]", "The index of the desired flip (defaults to current flip index)", -1)
    .action((index: number) => {
      return wrapAction(getFlip, parseInt(`${index}`, 10));
    });
};

export default { register };
