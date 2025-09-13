import { NextRequest, NextResponse } from "next/server";

const publicPaths = [
  "/login",
  "/signup",
  "/forgetPassword",
  "/checkEmail",
  "/resetPassword",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log("Middleware is running for path:", pathname);
  console.log("Cookies:", request.cookies.getAll());

  if (
    publicPaths.some((path) => pathname === path || pathname.startsWith(path))
  ) {
    console.log("Public path, allowing access:", pathname);
    return NextResponse.next();
  }

  const token = request.cookies.get("access_token")?.value;
  console.log("Access token:", token);

  if (!token || token === "undefined" || token.trim() === "") {
    console.log("No valid token found, redirecting to /login from:", pathname);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  console.log("Valid token found, proceeding to:", pathname);
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|_next/static|_next/image|favicon.ico).*)"],
};
