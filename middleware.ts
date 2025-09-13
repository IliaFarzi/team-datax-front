import { NextRequest, NextResponse } from "next/server";

const publicPaths = [
  "/login",
  "/signup",
  "/forgetPassword",
  "/checkEmail",
  "/resetPassword",
  "/api/auth",
  "/",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log("Middleware is running for path:", pathname);
  console.log("All Cookies:", request.cookies.getAll());

  const isPublicPath = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(path)
  );
  console.log("Is public path:", isPublicPath, "Path:", pathname);

  if (isPublicPath) {
    console.log("Allowing access to public path:", pathname);
    return NextResponse.next();
  }

  const token = request.cookies.get("access_token")?.value;
  console.log("Access token:", token);

  if (!token || token === "undefined" || token.trim() === "") {
    console.log("No valid token found, redirecting to /login from:", pathname);
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  console.log("Valid token found, proceeding to:", pathname);
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|_next/static|_next/image|favicon.ico).*)"],
};
