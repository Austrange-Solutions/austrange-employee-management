import { NextRequest, NextResponse } from "next/server";
export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname
    const isPublicPath = path === "/" || path === "/signin" || path === "/signup" || path === "/forgot-password" || path === "/reset-password";
    const token = request.cookies.get("accessToken")?.value || request.headers.get("Authorization")?.split(" ")[1] || "";
    if (isPublicPath && token) {
        // If the user is authenticated and tries to access a public path, redirect to dashboard
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    if (!isPublicPath && !token) {
        // If the user is not authenticated and tries to access a protected path, redirect to signin
        return NextResponse.redirect(new URL("/signin", request.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/signin",
        "/signup",
        "/forgot-password",
        "/reset-password",
    ]
}