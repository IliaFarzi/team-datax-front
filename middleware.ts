import { NextRequest, NextResponse } from "next/server";

const publicPaths = [
  "/login",
  "/signup",
  "/forgetPassword",
  "/checkEmail",
  "/resetPassword",
  "/not-found",
  "/api/auth",
  "/",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log("Middleware is running!");
  console.log("Requested Path:", pathname);
  console.log("Cookies:", request.cookies.getAll());

  if (publicPaths.includes(pathname)) {
    console.log("Public path, allowing access");
    return NextResponse.next();
  }

  const token = request.cookies.get("access_token")?.value;
  console.log("Access token:", token);

  if (!token) {
    console.log("No token, redirecting to /login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  console.log("Token found, proceeding");
  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"], 
};
