import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { Home, Search } from "@/pages";
import Signin from "@/pages/login/signin/Signin";
import Requests from "@/pages/requests/Requests";

const HomeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <Home />,
});

const SearchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/search",
  component: () => <Search />,
  validateSearch: (search?: { q: string }) => {
    if (search?.q) {
      return {
        q: search.q ?? "",
      };
    }
    return search;
  },
});

const RequestsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/requests",
  component: () => <Requests />,
});
const LoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => <Signin />,
});

const routes = [HomeRoute, SearchRoute, LoginRoute, RequestsRoute];
export default routes;
