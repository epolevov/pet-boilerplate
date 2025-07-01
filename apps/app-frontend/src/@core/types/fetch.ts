export type ErrorResponse = {
  message: string;
};

export type ListResponse<T> = {
  items: T[];
  nextOffset: number | null;
  count: number;
};

export type ListRequestParams = {
  where?: object;
  offset?: number;
  limit?: number;
  orderKey?: string;
  orderSort?: string;
};
