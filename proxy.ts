import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthPage =
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/registro") ||
    req.nextUrl.pathname.startsWith("/convite");
  const isApiAuth = req.nextUrl.pathname.startsWith("/api/auth");
  const isCron = req.nextUrl.pathname.startsWith("/api/cron");
  const isConviteApi = /^\/api\/convites\/[^/]+$/.test(req.nextUrl.pathname);
  const isWebhook = req.nextUrl.pathname.startsWith("/api/webhooks/");
  const isPublicMarketing =
    req.nextUrl.pathname === "/" ||
    req.nextUrl.pathname.startsWith("/precos") ||
    req.nextUrl.pathname.startsWith("/termos") ||
    req.nextUrl.pathname.startsWith("/privacidade");

  if (isApiAuth || isCron || isConviteApi || isWebhook || isPublicMarketing) return NextResponse.next();

  if (!isLoggedIn && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};
