import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "@/app/App";
import "@/app/styles";
import { QueryProvider } from "@app/providers/query/QueryProvider.tsx";
import { StoreProvider } from "@app/providers/store/StoreProvider.tsx";
import { AppInitializer } from "@app/providers/session/AppInitializer.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StoreProvider>
      <QueryProvider>
        <AppInitializer>
          <App />
        </AppInitializer>
      </QueryProvider>
    </StoreProvider>
  </StrictMode>,
);
