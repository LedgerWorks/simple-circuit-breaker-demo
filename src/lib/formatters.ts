import { BigNumberish } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { FlipStatus, Side } from "../../common/types";

const roundEther = (amount: number, decimals: number): number => {
  const offset = 10 ** decimals;
  return Math.round((amount + Number.EPSILON) * offset) / offset;
};

const removeTrailingZeroes = (amount: string): string => {
  return amount.toString().replace(/0+$/, "").replace(/\.$/, "");
};

export const formatBigNumber = (amount: BigNumberish, decimals = 3): string => {
  const etherAmount = formatEther(amount);
  const parsedAmount = parseFloat(etherAmount);
  if (parsedAmount === 0) return "-";
  const roundedAmount = roundEther(parsedAmount, decimals);
  const fixedAmount = roundedAmount.toFixed(decimals);
  const trimmedAmount = removeTrailingZeroes(fixedAmount);
  return trimmedAmount;
};

export const toSide = (side: Side): string => {
  switch (side) {
    case Side.Uninitialized:
      return "-";
    case Side.Heads:
      return "Heads";
    case Side.Tails:
      return "Tails";
    default:
      throw new Error("Invalid Side");
  }
};

export const toFlipStatus = (status: FlipStatus): string => {
  switch (status) {
    case FlipStatus.Ready:
      return "Ready";
    case FlipStatus.Loser:
      return "Loser";
    case FlipStatus.Winner:
      return "Winner";
    case FlipStatus.Reconciled:
      return "Reconciled";
    case FlipStatus.Error:
      return "Error";
    default:
      throw new Error("Invalid FlipStatus");
  }
};
