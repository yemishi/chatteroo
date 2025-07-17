import useScrollQuery from "@/hooks/useScrollQuery";

export const searchUser = (q?: string) => {
  return useScrollQuery({ url: `/search/user?q=${q}`, queryKey: ["search-users", q || ""] });
};
