import { NextApiRequest, NextApiResponse } from "next";
import { getPlayerBalance } from "@/lib/contract-calls/get-player-balance";
import { BigNumber } from "ethers";

export default async function handler(_req: NextApiRequest, res: NextApiResponse<BigNumber>) {
  try {
    const balance = await getPlayerBalance();
    return res.status(200).json(balance);
  } catch (error) {
    console.error(error);
    return res.status(500);
  }
}
