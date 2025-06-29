
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Add role-based authorization logic here if needed
    // For example, if (req.nextUrl.pathname.startsWith("/admin") && req.nextauth.token?.role !== "admin") {
    //   return NextResponse.rewrite(new URL("/denied", req.url));
    // }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/auth/signin",
    },
  }
);

export const config = {
  matcher: [
    "/leads/:path*",
    "/clients/:path*",
    "/cars/:path*",
    "/proposals/:path*",
    "/acquisitions/:path*",
  ],
};
