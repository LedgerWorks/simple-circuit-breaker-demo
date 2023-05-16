import { StandardPayload } from "./api-responses";

export const fetcher = async <T>(
  url: string,
  init?: RequestInit | undefined
): Promise<StandardPayload<T>> => {
  return fetch(url, init).then((res) => res.json());
};
