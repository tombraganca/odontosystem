import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";

import {
  getContext,
  Provider as TanStackQueryProvider,
} from "@/integrations/tanstack-query/root-provider.tsx";
import { AuthProvider } from "@/context/AuthContext.tsx";
import { routeTree } from "./route-tree.gen.ts";
import { Toaster } from "@/components/ui/sonner.tsx";

const TanStackQueryProviderContext = getContext();

const router = createRouter({
  routeTree,
  context: {
    ...TanStackQueryProviderContext,
  },
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <StrictMode>
      <TanStackQueryProvider {...TanStackQueryProviderContext}>
        <AuthProvider>
          <RouterProvider context={{}} router={router} />
          <Toaster />
        </AuthProvider>
      </TanStackQueryProvider>
    </StrictMode>
  );
}
