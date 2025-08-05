import { useNavigate, useRouter } from "@tanstack/react-router";

export function getRedirectPath(defaultPath = "/") {
  const url = window.location.pathname + window.location.search;
  return url === "/login" ? defaultPath : url;
}

export function getSession() {
  const { user } = useRouter().options.context;
  const navigate = useNavigate();
  if (!user) {
    navigate({ to: "/login", search: { redirect: getRedirectPath() } });
  }
  return user;
}
