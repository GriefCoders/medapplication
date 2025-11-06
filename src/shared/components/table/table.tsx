import type {
  Filters,
  RecursivePartial,
  SearchPayload,
  SearchResponse,
  Sorts,
} from "@/shared/api/types";
import type { DataTableColumn } from "@/shared/types/table";
import {
  Table as HeroTable,
  Input,
  Pagination,
  Spinner,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  type SortDescriptor,
} from "@heroui/react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";

export type FetchParams = {
  page: number;
  pageSize: number;
  sort?: SortDescriptor | null;
};

export type FetchResult<TItem> = {
  items: TItem[];
  total: number;
};

export type DataTableProps<
  TItem,
  F extends Filters = Record<string, unknown>,
  S extends Sorts = Record<string, never>
> = {
  columns: DataTableColumn<TItem>[];
  fetchData?: (params: FetchParams) => Promise<FetchResult<TItem>>;
  fetchSearch?: (
    payload: SearchPayload<F, S>
  ) => Promise<SearchResponse<TItem>>;
  queryKey?: unknown[];
  filters?: RecursivePartial<F>;
  mapSortKey?: (columnKey: string) => keyof S | string;
  renderCell?: (item: TItem, columnKey: string) => React.ReactNode;
  getRowKey?: (item: TItem) => string | number;
  initialSort?: SortDescriptor;
  initialPage?: number;
  initialPageSize?: number;
  pageSizeOptions?: number[];
  isStriped?: boolean;
  isHeaderSticky?: boolean;
  removeWrapper?: boolean;
  emptyContent?: React.ReactNode;
  className?: string;
  headerContent?: React.ReactNode;
  searchPlaceholder?: string;
  onSearch?: (searchTerm: string) => void;
};

export function DataTable<
  TItem,
  F extends Filters = Record<string, unknown>,
  S extends Sorts = Record<string, never>
>({
  columns,
  fetchData,
  fetchSearch,
  queryKey,
  filters,
  mapSortKey,
  renderCell,
  getRowKey,
  initialSort,
  initialPage = 1,
  initialPageSize = 10,
  pageSizeOptions = [10, 25, 50],
  isStriped,
  isHeaderSticky = true,
  removeWrapper,
  emptyContent = "Данные отсутствуют",
  className,
  headerContent,
  searchPlaceholder = "Поиск...",
  onSearch,
}: DataTableProps<TItem, F, S>) {
  const [page, setPage] = useState<number>(initialPage);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor | null>(
    initialSort ?? null
  );
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [items, setItems] = useState<TItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const pages = useMemo(() => {
    return Math.max(1, Math.ceil((total || 0) / pageSize));
  }, [total, pageSize]);

  const start = useMemo(
    () => (total === 0 ? 0 : (page - 1) * pageSize + 1),
    [page, pageSize, total]
  );
  const end = useMemo(
    () => Math.min(total, page * pageSize),
    [page, pageSize, total]
  );

  const rowKey = useCallback(
    (item: TItem): string | number => {
      if (getRowKey) return getRowKey(item);
      const anyItem = item as unknown as Record<string, unknown>;
      if (typeof anyItem.id === "string" || typeof anyItem.id === "number") {
        return anyItem.id as string | number;
      }
      return JSON.stringify(anyItem);
    },
    [getRowKey]
  );

  const computedSortKey = useMemo(() => {
    if (!sortDescriptor) return null;
    return String(
      mapSortKey?.(String(sortDescriptor.column)) ??
        String(sortDescriptor.column)
    );
  }, [sortDescriptor, mapSortKey]);

  const queryParams = useMemo(
    () => ({
      page,
      pageSize,
      sortDescriptor,
      filters,
      computedSortKey,
    }),
    [page, pageSize, sortDescriptor, filters, computedSortKey]
  );

  const resolvedBaseKey = useMemo(
    () => (Array.isArray(queryKey) ? queryKey : []),
    [queryKey]
  );

  const {
    data,
    isPending,
    isError,
    error: queryError,
  } = useQuery<FetchResult<TItem>, Error, FetchResult<TItem>, unknown[]>({
    queryKey: [...resolvedBaseKey, "data-table", queryParams],
    queryFn: async (): Promise<FetchResult<TItem>> => {
      if (fetchSearch) {
        const payload: SearchPayload<F, S> = {
          pagination: { page, count: pageSize },
          filters: filters as RecursivePartial<F> | undefined,
          sorts: computedSortKey
            ? ({
                [computedSortKey]:
                  sortDescriptor?.direction === "ascending" ? "asc" : "desc",
              } as unknown as RecursivePartial<S>)
            : undefined,
        };
        const res = await fetchSearch(payload);
        if (Array.isArray(res)) {
          const arr = res as unknown as TItem[];
          return { items: arr, total: arr.length };
        }
        const maybeObj = res as Partial<SearchResponse<TItem>> &
          Record<string, unknown>;
        const nextItems = (maybeObj.data as TItem[] | undefined) ?? [];
        const nextTotal =
          (maybeObj.count as number | undefined) ?? nextItems.length;
        return { items: nextItems, total: nextTotal };
      }
      if (fetchData) {
        const res = await fetchData({ page, pageSize, sort: sortDescriptor });
        return res;
      }
      throw new Error("Не указана функция загрузки данных");
    },
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    setIsLoading(isPending);
  }, [isPending]);

  useEffect(() => {
    if (isError) {
      const message =
        queryError instanceof Error
          ? queryError.message
          : "Ошибка загрузки данных";
      setError(message);
    } else {
      setError(null);
    }
  }, [isError, queryError]);

  useEffect(() => {
    if (data) {
      setItems(data.items);
      setTotal(data.total);
    }
  }, [data]);

  const topContent = useMemo(() => {
    const searchComponent = onSearch ? (
      <div className="flex items-center gap-2">
        <Input
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => {
            const value = e.target.value;
            setSearchTerm(value);
            if (onSearch) {
              onSearch(value);
            }
          }}
          className="w-64"
          size="sm"
        />
      </div>
    ) : null;

    if (headerContent || searchComponent) {
      return (
        <div className="flex items-center justify-between gap-3 p-2">
          {searchComponent}
          {headerContent}
        </div>
      );
    }
    return null;
  }, [headerContent, searchTerm, searchPlaceholder, onSearch]);

  const bottomContent = useMemo(() => {
    return (
      <div className="flex items-center justify-between px-2 py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-foreground/70">На странице:</label>
            <select
              className="bg-transparent text-foreground text-sm border border-border rounded-medium px-2 py-1"
              value={pageSize}
              onChange={(e) => {
                const next = Number(e.target.value);
                setPageSize(next);
                setPage(1);
              }}
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt} className="bg-background">
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <span className="text-sm text-foreground/70">
            Показано {start}
            {total > 0 ? `–${end}` : ""} из {total}
          </span>
        </div>
        <Pagination
          isCompact
          showControls
          page={page}
          total={pages}
          onChange={(next) => setPage(next)}
          classNames={{
            cursor: "bg-primary text-primary-foreground",
          }}
        />
      </div>
    );
  }, [page, pages, pageSize, pageSizeOptions, start, end, total]);

  const renderTableCell = useCallback(
    (item: TItem, columnKey: string) => {
      const col = columns.find((c) => String(c.key) === columnKey);
      if (col?.cell) return col.cell(item);
      if (renderCell) return renderCell(item, columnKey);
      const anyItem = item as unknown as Record<string, unknown>;
      return String(anyItem[columnKey] ?? "");
    },
    [columns, renderCell]
  );

  return (
    <div className={className}>
      <HeroTable
        aria-label="Таблица данных"
        isStriped={isStriped}
        isHeaderSticky={isHeaderSticky}
        removeWrapper={removeWrapper}
        sortDescriptor={sortDescriptor ?? undefined}
        onSortChange={(d) => {
          setSortDescriptor(d);
          setPage(1);
        }}
        topContent={topContent}
        bottomContent={bottomContent}
        classNames={{
          wrapper:
            "bg-background/40 backdrop-blur-md border border-border rounded-large",
          th: "text-foreground/80",
          td: "text-foreground",
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={String(column.key)}
              allowsSorting={column.allowsSorting}
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={items}
          isLoading={isLoading}
          loadingContent={<Spinner label="Загрузка..." />}
          emptyContent={
            error ? <span className="text-danger">{error}</span> : emptyContent
          }
        >
          {(item) => (
            <TableRow key={rowKey(item)}>
              {(columnKey) => (
                <TableCell>
                  {renderTableCell(item, String(columnKey))}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </HeroTable>
    </div>
  );
}

export default DataTable;
