export type EthersInnerError = {
  reason: string;
};

export type EthersError = {
  error: EthersInnerError;
};

export const isEthersError = (error: unknown): error is EthersError => {
  return Boolean((error as EthersError)?.error?.reason);
};

export const getEthersErrorMessage = (error: EthersError): string => {
  return error.error.reason.replace(/^execution reverted: /, "");
};

export const getErrorMessage = (error: unknown): string => {
  return isEthersError(error)
    ? getEthersErrorMessage(error)
    : (error as Error)?.message || "Unknown server error";
};
