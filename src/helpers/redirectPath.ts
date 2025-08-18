export function getRedirectPath(defaultPath = "/") {
  const url = window.location.pathname + window.location.search;
  return url === "/login" ? defaultPath : url;
}
