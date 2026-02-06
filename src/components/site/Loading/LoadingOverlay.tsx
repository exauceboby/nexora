"use client";

import Image from "next/image";
import Logo from "@/assets/logo.png";
import { useLoading } from "./LoadingProvider";

export default function LoadingOverlay() {
  const { loading } = useLoading();
  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#021231]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-20 w-20">
          <Image
            src={Logo}
            alt="NEXORA TECHNOLOGIES & NETWORKS"
            fill
            priority
            className="object-contain nexora-spin"
          />
        </div>
        <div className="text-sm text-white/80">Chargement…</div>
      </div>
    </div>
  );
}
