export interface Pagination {
  count: number;
  page: number;
}

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends object ? RecursivePartial<T[P]> : T[P];
};

export interface Filters {
  [key: string]: unknown;
}

export interface Sorts {
  [key: string]: "asc" | "desc" | undefined;
}

export type SearchPayload<
  F extends Filters,
  S extends Sorts = Record<string, never>
> = {
  pagination?: Pagination;
  filters?: RecursivePartial<F>;
  sorts?: RecursivePartial<S>;
};

export type SearchResponse<T> = {
  data: T[];
  count: number;
};

export type ErrorResponse = {
  error: string;
  message: string | string[];
  statusCode: number;
};
