export const getQueryStringValue = (
  query: Partial<{
    [key: string]: string | string[];
  }>,
  key: string
): string | undefined => {
  const result = query[key];
  return Array.isArray(result) ? result.at(0) : result;
};
