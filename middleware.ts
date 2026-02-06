import { NextRequest, NextResponse } from "next/server";
import { isLang, Lang, DEFAULT_LANG } from "./src/i18n/config";

function detectLang(req: NextRequest): Lang {
  const header = req.headers.get("accept-language") || "";
  const prefersFr = header.toLowerCase().includes("fr");
  const prefersEn = header.toLowerCase().includes("en");
  if (prefersFr && !prefersEn) return "fr";
  if (prefersEn && !prefersFr) return "en";
  return DEFAULT_LANG;
}

function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="NEXORA Admin"' },
  });
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Ignore next internals & assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // ===========================
  // Basic Auth for /admin/*
  // ===========================
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const user = process.env.ADMIN_USER || "";
    const pass = process.env.ADMIN_PASS || "";

    // Sécurité: si non configuré, on bloque
    if (!user || !pass) {
      return new NextResponse("Admin not configured", { status: 503 });
    }

    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Basic ")) return unauthorized();

    const b64 = auth.slice("Basic ".length).trim();

    let decoded = "";
    try {
      decoded = atob(b64);
    } catch {
      return unauthorized();
    }

    const sep = decoded.indexOf(":");
    if (sep < 0) return unauthorized();

    const u = decoded.slice(0, sep);
    const p = decoded.slice(sep + 1);

    if (u !== user || p !== pass) return unauthorized();

    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];

  // Already has lang
  if (first && isLang(first)) return NextResponse.next();

  const lang = detectLang(req);
  const url = req.nextUrl.clone();
  url.pathname = `/${lang}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
