import { NextRequest, NextResponse } from "next/server";

const publicPaths = [
  "/login",
  "/signup",
  "/forgetPassword",
  "/checkEmail",
  "/resetPassword",
  "/api/auth",
  "/",
  "/checkPassword",
  "/waiting-list",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log("hello world!!");
  console.log("Middleware is running at:", new Date().toISOString());
  console.log("Requested Path:", pathname);
  console.log("All Cookies:", request.cookies.getAll());
  const isPublicPath = publicPaths.includes(pathname);
  console.log("Is public path:", isPublicPath, "Path:", pathname);

  if (isPublicPath) {
    console.log("Allowing access to public path:", pathname);
    return NextResponse.next();
  }

  const token = request.cookies.get("access_token")?.value;
  console.log("Access token:", token);

  if (!token || token.trim() === "" || token === "undefined") {
    console.log("No valid token found, redirecting to /login from:", pathname);
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (pathname === "/chat") {
    const canChat = request.cookies.get("can_chat")?.value === "true";
    console.log("Can chat:", canChat);
    if (!canChat) {
      console.log("User cannot chat, redirecting to /waiting-list");
      return NextResponse.redirect(new URL("/waiting-list", request.url));
    }
  }

  console.log("Valid token found, proceeding to:", pathname);
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|api|_next/static|_next/image|favicon.ico|site.webmanifest).*)",
  ],
};
