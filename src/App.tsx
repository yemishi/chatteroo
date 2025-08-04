import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>🔄 Fetching user hodon…</div>;
  return (
    <RouterProvider
      router={router}
      context={{
        user,
      }}
    />
  );
}
