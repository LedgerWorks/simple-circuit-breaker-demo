import { program } from "commander";
import wrapAction from "../wrap-action";
import { getContractForAdmin } from "../../common/ethers-helpers";

export const isDisabled = async () => {
  const contract = getContractForAdmin();
  const disabled = await contract.disabled();
  console.log({ isDisabled: disabled });
};

export const register = (): void => {
  program
    .command("is-disabled")
    .description("Returns whether the game is currently disabled")
    .action(() => wrapAction(isDisabled));
};
