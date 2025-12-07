import { QUERY_KEYS } from "@/shared/api/query-keys";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { Site } from "../model";
import { searchSites } from "./site";

export const useSearchSites = (
  query?: string,
  options?: Omit<UseQueryOptions<Site[]>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SITE.SEARCH, query],
    queryFn: () => searchSites(query),
    ...options,
  });
};

