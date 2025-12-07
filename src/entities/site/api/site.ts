import { api } from "@/shared/api";
import type { Site } from "../model";

export const searchSites = async (query?: string) => {
  const response = await api.get<Site[]>("/site/search", {
    params: { query },
  });
  return response.data;
};

