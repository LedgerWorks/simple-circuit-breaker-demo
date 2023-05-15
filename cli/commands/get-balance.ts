import { program } from "commander";
import wrapAction from "../wrap-action";
import { ethers } from "ethers";
import { getContractForAdmin } from "../../common/ethers-helpers";

export const getBalance = async () => {
  const contract = getContractForAdmin();
  const balance = await contract.getBalance();
  console.log({ balance: ethers.utils.formatEther(balance) });
};

export const register = (): void => {
  program
    .command("get-balance")
    .description("Gets a the contract's balance")
    .action(() => wrapAction(getBalance));
};

export default { register };
