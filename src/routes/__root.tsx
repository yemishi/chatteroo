import { Toast } from "@/components";
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
      <div key={location} className="layout">
        <Toast />
        <div className="content">
          <Outlet />
        </div>
        {!isLogin && <NavBar />}
      </div>
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
