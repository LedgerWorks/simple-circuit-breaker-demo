import { NextApiRequest, NextApiResponse } from "next";
import { getCurrentFlip } from "@/lib/contract-calls/get-current-flip";
import { Flip } from "../../../common/types";

export default async function handler(_req: NextApiRequest, res: NextApiResponse<Flip>) {
  try {
    const flip = await getCurrentFlip();
    return res.status(200).json(flip);
  } catch (error) {
    console.error(error);
    return res.status(500);
  }
}
