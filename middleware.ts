import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const publicRoutes = ["/", "/login", "/signup", "/profile/setup","/upgrade/pro"];
  const isPublic = publicRoutes.includes(pathname);

  const token = req.cookies.get("token")?.value;
  let isAuthenticated = false;

  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      isAuthenticated = true;
    } catch {
      if (!isPublic) {
        const res = NextResponse.redirect(new URL("/login", req.url));
        res.cookies.set("token", "", { maxAge: 0 });
        return res;
      }
    }
  }

  if (!isAuthenticated && !isPublic) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAuthenticated && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api|.*\\..*).*)" ],
};