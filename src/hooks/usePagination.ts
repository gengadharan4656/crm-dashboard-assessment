import { useMemo, useState, useEffect } from 'react';

interface Options<T> {
  data: T[];
  pageSize: number;
}

export function usePagination<T>({ data, pageSize }: Options<T>) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));

  useEffect(() => {
    setPage(1);
  }, [data.length]);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, page, pageSize]);

  return { page, setPage, totalPages, paged, pageSize };
}
