export type DataTableColumn<TItem> = {
  key: keyof TItem | string;
  label: string;
  width?: string | number;
  minWidth?: string | number;
  allowsSorting?: boolean;
  cell?: (item: TItem) => React.ReactNode;
};
