import { getContractForAdmin } from "../../common/ethers-helpers";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function handler(event: any) {
  console.debug({ event });
  const contract = getContractForAdmin();
  const tx = await contract.disable();
  const receipt = await tx.wait();
  if (receipt.status === 0) {
    console.debug({ receipt });
    throw new Error("Transaction failed");
  }
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "success" }),
    isBase64Encoded: false,
  };
}
