import * as collect from "./collect";
import * as deposit from "./deposit";
import * as disable from "./disable";
import * as enable from "./enable";
import * as flip from "./flip";
import * as getBalance from "./get-balance";
import * as getFlip from "./get-flip";
import * as isDisabled from "./is-disabled";
import * as withdraw from "./withdraw";

const allCommands = [
  collect,
  deposit,
  disable,
  enable,
  flip,
  getBalance,
  getFlip,
  isDisabled,
  withdraw,
];

export default allCommands;
