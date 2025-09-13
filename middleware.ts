import { NextRequest, NextResponse } from "next/server";

const publicPaths = [
  "/login",
  "/signup",
  "/forgetPassword",
  "/checkEmail",
  "/resetPassword",
  "/",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log("Middleware is running!");
  console.log("Requested Path:", pathname);
  console.log("Cookies:", request.cookies.getAll());

  if (
    publicPaths.some((path) => pathname === path || pathname.startsWith(path))
  ) {
    console.log("Public path, allowing access");
    return NextResponse.next();
  }

  const token = request.cookies.get("access_token")?.value;
  console.log("Access token:", token);

  if (!token || token === "undefined" || token.trim() === "") {
    console.log("No valid token, redirecting to /login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  console.log("Valid token found, proceeding");
  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
