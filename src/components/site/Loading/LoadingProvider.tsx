"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type LoadingCtx = {
  start: () => void;
  stop: () => void;
  loading: boolean;
};

const Ctx = createContext<LoadingCtx | null>(null);

export function useLoading() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLoading must be used within LoadingProvider");
  return ctx;
}

export default function LoadingProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  const start = useCallback(() => setLoading(true), []);
  const stop = useCallback(() => setLoading(false), []);

  // Dès que la route change, on coupe le loader.
  useEffect(() => {
    setLoading(false);
  }, [pathname]);

  return <Ctx.Provider value={{ start, stop, loading }}>{children}</Ctx.Provider>;
}
