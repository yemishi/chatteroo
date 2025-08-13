"use client";

import { axiosInstance } from "@/lib/api/axiosInstance";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";

export default function useScrollQuery<T>({ queryKey, url, stop }: PropsType) {
  const ref = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const [error, setError] = useState<Error | null>();
  const fetchData = async (page: number) => {
    try {
      const mark = url.includes("?") ? "&" : "?";
      const data = (await axiosInstance.get(`${url}${mark}page=${page - 1}`)).data;
      return data as T;
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || "Something went wrong";
      const name = error?.name || "UnknownError";

      setError({ message, name });
      throw new Error(message);
    }
  };

  const {
    data,
    error: defaultError,
    ...rest
  } = useInfiniteQuery<T>({
    queryKey,
    queryFn: ({ pageParam }) => fetchData(pageParam as number),
    getNextPageParam: (lastPage, allPages) => {
      const oldPage = lastPage as { hasMore: boolean };
      return oldPage.hasMore && !stop ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    refetchOnWindowFocus: false,
  });

  const values = useMemo(() => {
    if (!data) return [];

    const result = data.pages.reduce((acc: T[], curr: any) => {
      const { hasMore, ...rest } = curr;
      const values = Object.values(rest)[0] as T[];
      const currArr = Array.isArray(values) ? values : (Array.from(values) as T[]);

      return [...acc, ...currArr];
    }, []);
    return result;
  }, [data]);

  useEffect(() => {
    if (!rest.isLoading && rest.hasNextPage) {
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !rest.isFetchingNextPage) rest.fetchNextPage();
      });
      if (ref.current) observer.current.observe(ref.current);
    }
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [rest.isFetchingNextPage, rest.hasNextPage, rest.fetchNextPage, ref.current]);

  return {
    ref,
    values,
    error: defaultError || error,
    ...rest,
  };
}

type PropsType = {
  url: string;
  queryKey: string[];
  stop?: boolean;
};
