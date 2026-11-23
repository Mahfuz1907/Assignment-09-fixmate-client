import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthPage = pathname === "/sign-in" || pathname === "/sign-up";
  const isDashboardPage = pathname.startsWith("/dashboard");

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!session && isDashboardPage) {
    const signInUrl = new URL("/sign-in", request.url);
    if (pathname === "/dashboard/profile") {
      signInUrl.searchParams.set("redirect", pathname);
    }
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/sign-in", "/sign-up", "/payment/:path*"],
};
