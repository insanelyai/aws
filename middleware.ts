import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Allow preflight requests to pass through
  // if (request.method === "OPTIONS") {
  //   return new NextResponse(null, {
  //     status: 204,
  //     headers: {
  //       "Access-Control-Allow-Origin": "http://18.215.226.190:3000",
  //       "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  //       "Access-Control-Allow-Headers": "Content-Type, Authorization",
  //     },
  //   });
  // }

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isLoginRoute = request.nextUrl.pathname === "/admin";
  const isAuthenticated = request.cookies.has("token");

  if (isAdminRoute && !isLoginRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (isLoginRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  // Add CORS headers to all other requests
  const response = NextResponse.next();
  // response.headers.set(
  //   "Access-Control-Allow-Origin",
  //   "http://18.215.226.190:3000"
  // );
  // response.headers.set(
  //   "Access-Control-Allow-Methods",
  //   "GET, POST, PUT, DELETE, OPTIONS"
  // );
  // response.headers.set(
  //   "Access-Control-Allow-Headers",
  //   "Content-Type, Authorization"
  // );
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"], // apply to both admin and API routes
};
