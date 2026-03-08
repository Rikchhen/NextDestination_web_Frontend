import { NextRequest, NextResponse } from "next/server";
import { getUserData, getAuthToken } from "./lib/cookie";

const publicPaths = ["/login", "/register", "/forgot-password", "/business/login"];
const adminPaths = ["/admin"];
const businessPaths = ["/business"];

export async function proxy(req: NextRequest) {
  // logics here
  const { pathname } = req.nextUrl;
  const token = await getAuthToken();
  const user = token ? await getUserData() : null;

  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));
  const isAdminPath = adminPaths.some((path) => pathname.startsWith(path));
  const isBusinessPath = businessPaths.some((path) => pathname.startsWith(path));
  const isBusinessLoginPath = pathname.startsWith("/business/login");

  if (user && token) {
    if (isAdminPath && user.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (isBusinessPath && !isBusinessLoginPath && user.role !== "Business") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (isBusinessLoginPath && user.role === "Business") {
      return NextResponse.redirect(new URL("/business", req.url));
    }
  }
  if (isAdminPath && !user) {
    // If they aren't even logged in, send them to login
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (isBusinessPath && !isBusinessLoginPath && !user) {
    return NextResponse.redirect(new URL("/business/login", req.url));
  }
  if (isPublicPath && user) {
    if (pathname.startsWith("/business/login") && user.role === "Business") {
      return NextResponse.redirect(new URL("/business", req.url));
    }
    if (pathname.startsWith("/business/login")) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (user.role === "Business") {
      return NextResponse.redirect(new URL("/business", req.url));
    }
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.next(); // continue/granted
}

export const config = {
  matcher: [
    // list of path to apply rules/proxy
    "/admin/:path*",
    "/business/:path*",
    "/login",
    "/register",
    "/business/login",
  ],
};
