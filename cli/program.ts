import { program } from "commander";
import commands from "./commands";

program
  .name("coinflip-cli")
  .description("CLI wrapper around the CoinFlip smart contract")
  .version("0.0.1");

commands.forEach((command) => command.register());

program.parseAsync().then(() => {});
