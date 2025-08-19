import { createRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { Home, Search } from "@/pages";
import Signin from "@/pages/login/signin/Signin";
import NotificationPage from "@/pages/notification/Notification";
import Register from "@/pages/login/register/Register";
import type { JSX } from "react";
import { useAuth } from "@/hooks";
import { getRedirectPath } from "@/helpers";
import Settings from "@/pages/settings/Settings";
import SettingsProfile from "@/pages/settings/setingsProfile/SettingsProfile";
import SettingsUpgradeAccount from "@/pages/settings/settingsUpgradeAccount/SettingsUpgradeAccount";

const HomeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <Middleware>
      <Home />
    </Middleware>
  ),
});

const SearchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/search",
  component: () => (
    <Middleware>
      <Search />
    </Middleware>
  ),
  validateSearch: (search?: { q: string }) => {
    if (search?.q) {
      return {
        q: search.q ?? "",
      };
    }
    return search;
  },
});
const SettingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: () => (
    <Middleware>
      <Settings />
    </Middleware>
  ),
});

const SettingsProfileRoute = createRoute({
  getParentRoute: () => SettingsRoute,
  path: "/profile",
  component: () => <SettingsProfile />,
});
const SettingsUpgradeAccRoute = createRoute({
  getParentRoute: () => SettingsRoute,
  path: "/upgrade__account",
  component: () => <SettingsUpgradeAccount />,
});

const NotificationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/notifications",
  component: () => (
    <Middleware>
      <NotificationPage />
    </Middleware>
  ),
});
const RegisterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: () => (
    <Middleware isAuthRoute>
      <Register />
    </Middleware>
  ),
});
const LoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => (
    <Middleware isAuthRoute>
      <Signin />
    </Middleware>
  ),
});

const routes = [
  HomeRoute,
  SearchRoute,
  LoginRoute,
  NotificationRoute,
  RegisterRoute,
  SettingsRoute,
  SettingsProfileRoute,
  SettingsUpgradeAccRoute,
];
export default routes;

function Middleware({ children, isAuthRoute }: { children: JSX.Element; isAuthRoute?: boolean }) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) return <div>🔄 Fetching user hodon…</div>;

  if (!user) navigate({ to: "/login", search: { redirect: getRedirectPath() } });

  if (user && isAuthRoute) navigate({ to: "/settings", search: { redirect: getRedirectPath() } });
  return children;
}
