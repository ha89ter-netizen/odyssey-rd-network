"use client";

import { StoreProvider } from "@/store/store";
import { ToastProvider } from "@/ui/primitives";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <ToastProvider>{children}</ToastProvider>
    </StoreProvider>
  );
}
