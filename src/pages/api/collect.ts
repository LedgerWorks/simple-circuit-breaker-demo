import { NextApiRequest, NextApiResponse } from "next";
import { StandardPayload, methodNotAllowed, serverError, success } from "@/lib/api-responses";
import { collect } from "@/lib/contract-calls/collect";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StandardPayload<undefined>>
) {
  if (req.method !== "POST") {
    return methodNotAllowed(res);
  }

  try {
    await collect();
    return success(res, undefined);
  } catch (error) {
    console.error(`Error calling collect: ${(error as Error).message}`, error);
    return serverError(res, (error as Error).message);
  }
}
