"use client";

import { usePathname } from "next/navigation";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // key force le remount => l'animation se rejoue à chaque navigation
  return (
    <div key={pathname} className="nexora-page">
      {children}
    </div>
  );
}
