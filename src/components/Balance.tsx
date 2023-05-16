import { BigNumber } from "ethers";
import useSWR from "swr";
import { formatBigNumber } from "@/lib/formatters";

export function Balance() {
  const { data: balance } = useSWR<BigNumber>("/api/get-player-balance");
  return balance ? <div>{formatBigNumber(balance)}</div> : <div>-</div>;
}
