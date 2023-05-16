import { program } from "commander";
import wrapAction from "../wrap-action";
import { getContractForAdmin } from "../../common/ethers-helpers";
import { getPlayerAddress } from "../../common/env";

export const getFlip = async (index: number) => {
  const contract = getContractForAdmin();
  const playerAddress = getPlayerAddress();
  const flipIndex =
    index < 0 || Number.isNaN(index)
      ? (await contract.getCurrentFlipIndex(playerAddress)).toNumber()
      : index;
  const flip = await contract.getFlip(playerAddress, flipIndex);
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
