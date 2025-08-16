import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { Home, Search } from "@/pages";
import Signin from "@/pages/login/signin/Signin";
import NotificationPage from "@/pages/notification/Notification";
import Register from "@/pages/login/register/Register";
import Account from "@/pages/account/Account";

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
const AccountRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/account",
  component: () => <Account />,
});
const NotificationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/notifications",
  component: () => <NotificationPage />,
});
const RegisterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: () => <Register />,
});
const LoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => <Signin />,
});

const routes = [HomeRoute, SearchRoute, LoginRoute, NotificationRoute, RegisterRoute, AccountRoute];
export default routes;
