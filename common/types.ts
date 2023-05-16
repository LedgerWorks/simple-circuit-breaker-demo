import { BigNumber } from "ethers";

export enum Side {
  Uninitialized,
  Heads,
  Tails,
}

export enum FlipStatus {
  Ready,
  Loser,
  Winner,
  Reconciled,
  Error,
}

export type Flip = {
  status: FlipStatus;
  calledSide: Side;
  wagerAmount: BigNumber;
  flipFee: BigNumber;
  payoutAmount: BigNumber;
  flipResult: Side;
};
