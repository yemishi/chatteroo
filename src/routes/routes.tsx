import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { Home, Search } from "@/pages";

const HomeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <Home />,
});

const TestRoutePage = createRoute({
  getParentRoute: () => rootRoute,
  path: "/search",
  component: () => <Search />,
});

const routes = [HomeRoute, TestRoutePage];
export default routes;
