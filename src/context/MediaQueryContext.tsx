import { createContext, useContext, type ReactNode } from "react";
import { useMediaQuery } from "../hooks/useMediaQuery";

type MediaQueryContextValue = {
  isDesktop: boolean;
};

const MediaQueryContext = createContext<MediaQueryContextValue | null>(null);

/** Provides a single `(min-width: 1280px)` listener for the whole tree. */
export function MediaQueryProvider({ children }: { children: ReactNode }) {
  const isDesktop = useMediaQuery("(min-width: 1280px)");

  return (
    <MediaQueryContext.Provider value={{ isDesktop }}>
      {children}
    </MediaQueryContext.Provider>
  );
}

export function useIsDesktop(): boolean {
  const ctx = useContext(MediaQueryContext);
  if (!ctx) throw new Error("useIsDesktop must be used within MediaQueryProvider");
  return ctx.isDesktop;
}
