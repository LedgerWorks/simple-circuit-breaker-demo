import { NextApiRequest, NextApiResponse } from "next";
import { StandardPayload, methodNotAllowed, serverError, success } from "@/lib/api-responses";
import { incrementCurrentFlip } from "@/lib/contract-calls/increment-current-flip";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StandardPayload<undefined>>
) {
  if (req.method !== "POST") {
    return methodNotAllowed(res);
  }

  try {
    await incrementCurrentFlip();
    return success(res, undefined);
  } catch (error) {
    console.error(error);
    return serverError(res, (error as Error).message);
  }
}
