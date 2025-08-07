import NavBar from "@/components/navBar/NavBar";
import type { User } from "@/types";
import { createRootRouteWithContext } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";

export const rootRoute = createRootRouteWithContext<{ user: User | null }>()({
  component: () => (
    <>
      <Outlet />
      <NavBar />
    </>
  ),
  pendingComponent: () => <div>Loading...</div>,
  validateSearch: (search?: { redirect?: string }) => {
    if (search?.redirect) {
      return {
        redirect: search?.redirect ?? undefined,
      };
    }
    return search;
  },
});
