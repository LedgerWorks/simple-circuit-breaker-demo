// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const map = <T>(arr: any[]): T => {
  const out = {};
  Object.keys(arr)
    .filter((key) => Number.isNaN(parseInt(key, 10)))
    .forEach((key) => {
      out[key] = arr[key];
    });
  return out as T;
};
