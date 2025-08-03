import useScrollQuery from "@/hooks/useScrollQuery";
import type { SearchUser } from "@/types/searchType";

export const searchUser = (q?: string) => {
  return useScrollQuery<SearchUser>({ url: `/search/user?q=${q}`, queryKey: ["search-users", q || ""] });
};
