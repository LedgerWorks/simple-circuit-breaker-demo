import { NextApiRequest, NextApiResponse } from "next";
import { BadRequestError, RequestError } from "@/lib/api-errors";
import { StandardPayload, methodNotAllowed, serverError, success } from "@/lib/api-responses";
import { flip } from "@/lib/contract-calls/flip";
import { Flip, Side } from "../../../common/types";
import { getErrorMessage } from "@/lib/ethers-errors";
import { getCurrentFlip } from "@/lib/contract-calls/get-current-flip";
import { sleep } from "../../../common/utils";

export type FlipRequest = {
  side: Side;
  wager: number;
  timestamp: number;
};

const parseRequestBody = (body: FlipRequest): FlipRequest => {
  const { side, wager } = body;
  const timestamp = parseInt(`${body.timestamp ?? Date.now()}`, 10);

  const validationErrors = [];

  if (side === undefined) validationErrors.push("Missing side");
  else if (side !== Side.Heads && side !== Side.Tails) validationErrors.push("Invalid side");

  if (wager === undefined) validationErrors.push("Missing wager");
  else if (typeof wager !== "number") validationErrors.push("Invalid wager");
  else if (wager < 0.01) validationErrors.push("Wager cannot be less than 0.01");
  else if (wager > 1) validationErrors.push("Wager cannot be greater than 1");

  if (Number.isNaN(timestamp)) validationErrors.push("Invalid timestamp");

  if (validationErrors.length > 0) {
    throw new BadRequestError(`Bad Request: ${validationErrors.join(", ")}`);
  }

  return { side, wager, timestamp };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StandardPayload<Flip>>
) {
  if (req.method !== "POST") {
    return methodNotAllowed(res);
  }

  try {
    const { side, wager, timestamp } = parseRequestBody(req.body);
    await flip(side, wager, timestamp);
    await sleep(1000);
    const currentFlip = await getCurrentFlip();
    return success(res, currentFlip);
  } catch (error) {
    if (error instanceof RequestError) {
      return error.toErrorResponse(res);
    }
    const message = getErrorMessage(error);
    console.error(message);
    return serverError(res, message);
  }
}
