"use client";

import { StoreProvider } from "@/store/store";
import { ToastProvider } from "@/ui/primitives";
import { I18nProvider } from "@/i18n/i18n";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <StoreProvider>
        <ToastProvider>{children}</ToastProvider>
      </StoreProvider>
    </I18nProvider>
  );
}
