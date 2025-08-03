import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { Home, Search } from "@/pages";

const HomeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <Home />,
});

const SearchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/search",
  component: () => <Search />,
  validateSearch: (search: { q: string }) => {
    return {
      q: search.q ?? "",
    };
  },
});

const routes = [HomeRoute, SearchRoute];
export default routes;
