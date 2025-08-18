import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";
import { useAuth } from "./hooks";
import { useEffect } from "react";

export default function App() {
  const { fetchUser } = useAuth();
  useEffect(() => {
    fetchUser();
  }, []);

  return <RouterProvider router={router} />;
}
