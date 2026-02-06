import Image from "next/image";
import Logo from "@/assets/logo.png";

export default function Loading() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#021231] px-4">
      <div className="flex flex-col items-center gap-5">
        <div className="relative">
          <div className="absolute -inset-6 rounded-full nexora-loading-glow" />
          <div className="relative h-16 w-16">
            <Image
              src={Logo}
              alt="NEXORA TECHNOLOGIES & NETWORKS"
              fill
              className="object-contain nexora-float"
              priority
            />
          </div>
        </div>

        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/25 border-t-cyan-300" />
        <div className="text-sm text-white/80">Chargement…</div>
      </div>
    </div>
  );
}
