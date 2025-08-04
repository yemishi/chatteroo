import "./styles/main.scss";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./context/AuthContext.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App.tsx";

const queryClient = new QueryClient();

const darkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
const root = document.documentElement;
if (darkTheme) {
  root.setAttribute("data-theme", "dark");
} else {
  root.setAttribute("data-theme", "light");
}
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <main>
          <App />
        </main>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
