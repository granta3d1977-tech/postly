import { NextResponse } from "next/server";
import { auth } from "./auth";

export default auth((request) => {
  const pathname = request.nextUrl.pathname;
  const isPublic = pathname === "/" || pathname === "/login" || pathname.startsWith("/api/auth");

  if (!isPublic && !request.auth) {
    const loginUrl = new URL("/login", request.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.href);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
