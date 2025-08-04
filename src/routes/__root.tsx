import type { User } from "@/types";
import { createRootRouteWithContext } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";

export const rootRoute = createRootRouteWithContext<{ user: User | null }>()({
  component: () => <Outlet />,
  pendingComponent: () => <div>Loading...</div>,
  validateSearch: (search: { redirect?: string }) => {
    return {
      redirect: search.redirect ?? undefined,
    };
  },
});
