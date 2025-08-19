import "./styles.scss";
import NavBar from "@/components/navBar/NavBar";
import { createRootRoute, useRouterState } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";

export const rootRoute = createRootRoute({
  component: () => {
    const location = useRouterState({
      select: (s) => s.location.pathname,
    });
    const isLogin = location === "/login";

    return (
      <>
        <div key={location} className="page-transition">
          <Outlet />
        </div>
        {!isLogin && <NavBar />}
      </> 
    );
  },
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
