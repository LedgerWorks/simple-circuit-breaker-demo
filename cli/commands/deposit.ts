/* eslint-disable @typescript-eslint/no-explicit-any */
import { ethers, BigNumber } from "ethers";
import { program } from "commander";
import wrapAction from "../wrap-action";
import { chainId, getEnv } from "../../common/env";
import { getAvalancheCChain, getAdminWallet, getProvider } from "../../common/ethers-helpers";

type TransactionOptions = {
  nonce: any;
  maxFeePerGas: any;
  maxPriorityFeePerGas: any;
};

const getNonce = async (options: TransactionOptions): Promise<number> => {
  const nonce = Number.isNaN(parseInt(options.nonce, 10))
    ? await getProvider().getTransactionCount(getAdminWallet().address)
    : parseInt(options.nonce, 10);
  console.info(`nonce differentiator: ${nonce}`);
  return nonce;
};

const calculateMaxPriorityFeePerGas = async (options: TransactionOptions): Promise<number> => {
  let maxPriorityFeePerGas = parseInt(options.maxPriorityFeePerGas, 10);
  if (Number.isNaN(maxPriorityFeePerGas)) {
    const chainMaxPriorityFeePerGas = await getAvalancheCChain().getMaxPriorityFeePerGas();
    const parsedChainMaxPriorityFeePerGas = parseInt(chainMaxPriorityFeePerGas, 16);
    maxPriorityFeePerGas = parsedChainMaxPriorityFeePerGas / 1e9;
  }
  console.info(`maxPriorityFeePerGas: ${maxPriorityFeePerGas}`);
  return maxPriorityFeePerGas;
};

const calculateMaxFeePerGas = async (
  options: TransactionOptions,
  maxPriorityFeePerGas: number
): Promise<number> => {
  let maxFeePerGas = parseInt(options.maxFeePerGas, 10);
  if (Number.isNaN(maxFeePerGas)) {
    const chainBaseFee = await getAvalancheCChain().getBaseFee();
    const parsedChainBaseFee = parseInt(chainBaseFee, 16);
    const baseFee = parsedChainBaseFee / 1e9;
    maxFeePerGas = baseFee + maxPriorityFeePerGas;
  }
  console.info(`maxFeePerGas: ${maxFeePerGas}`);
  return maxFeePerGas;
};

const calcFeeData = async (
  options: TransactionOptions
): Promise<{
  maxFeePerGas: ethers.BigNumber;
  maxPriorityFeePerGas: ethers.BigNumber;
}> => {
  const maxPriorityFeePerGas = await calculateMaxPriorityFeePerGas(options);
  const maxFeePerGas = await calculateMaxFeePerGas(options, maxPriorityFeePerGas);

  if (maxFeePerGas < maxPriorityFeePerGas) {
    throw new Error("Error: Max fee per gas cannot be less than max priority fee per gas");
  }

  return {
    maxFeePerGas: ethers.utils.parseUnits(`${maxFeePerGas}`, "gwei"),
    maxPriorityFeePerGas: ethers.utils.parseUnits(`${maxPriorityFeePerGas}`, "gwei"),
  };
};

export const deposit = async (amount: BigNumber, options: TransactionOptions) => {
  const provider = getProvider();
  const { COINFLIP_CONTRACT_ADDRESS } = getEnv();

  const nonce = await getNonce(options);
  const { maxFeePerGas, maxPriorityFeePerGas } = await calcFeeData(options);

  const tx: any = {
    type: 2,
    to: COINFLIP_CONTRACT_ADDRESS,
    value: amount,
    chainId,
    nonce,
    maxFeePerGas,
    maxPriorityFeePerGas,
  };

  tx.gasLimit = await provider.estimateGas(tx);

  const signedTx = await getAdminWallet().signTransaction(tx);
  const txHash = ethers.utils.keccak256(signedTx);

  console.log(`Sending signed transaction txHash: ${txHash}`);
  await (await provider.sendTransaction(signedTx)).wait();

  console.log(
    `View transaction with nonce ${nonce} - Fuji Testnet: https://testnet.snowtrace.io/tx/${txHash}`,
    `or Mainnet: https://snowtrace.io//tx/${txHash}`
  );
};

export const register = (): void => {
  program
    .command("deposit")
    .description("[admin] Deposit AVAX into the CoinFlip contract")
    .argument("<number>", "The amount of AVAX to send to the contract")
    .option("--maxFeePerGas <number>", "maximum fee per gas you want to pay in nAVAX")
    .option(
      "--maxPriorityFeePerGas <number>",
      "maximum priority fee per gas you want to pay in nAVAX"
    )
    .option("--nonce <number>", "differentiator for more than 1 transaction with same signer")
    .action((amount: string, options: Partial<TransactionOptions>) => {
      return wrapAction(deposit, ethers.utils.parseEther(amount), options);
    });
};

export default { register };
