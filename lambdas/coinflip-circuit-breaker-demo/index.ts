import { getContractForAdmin } from "../../common/ethers-helpers";

export async function handler(event: any) {
  console.debug({ event });
  const contract = getContractForAdmin();
  const tx = await contract.disable();
  const receipt = await tx.wait();
  console.debug({ receipt });
  if (receipt.status === 0) {
    throw new Error("Transaction failed");
  }
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "success" }),
    isBase64Encoded: false,
  };
}
