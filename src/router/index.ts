import { Router } from "@tanstack/react-router";
import routeTree from "./routeTree";

export const router = new Router({ routeTree, context: { user: null } });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
