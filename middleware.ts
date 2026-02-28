// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { jwtVerify } from "jose";

// const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

// export async function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   console.log("PATH:", pathname);
//   console.log("ALL COOKIES:", req.cookies.getAll().map(c => c.name));

//   const publicRoutes = ["/", "/login", "/signup"];
//   const isPublic = publicRoutes.includes(pathname);

//   const token = req.cookies.get("token")?.value;
//   const googleSession =
//     req.cookies.get("authjs.session-token")?.value ||
//     req.cookies.get("__Secure-authjs.session-token")?.value;

//   console.log("token:", !!token, "googleSession:", !!googleSession);

//   const isAuthenticated = !!googleSession;

//   if (!token && !isAuthenticated && !isPublic) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   if (token) {
//     try {
//       await jwtVerify(token, JWT_SECRET);
//     } catch {
//       const res = NextResponse.redirect(new URL("/login", req.url));
//       res.cookies.set("token", "", { maxAge: 0 });
//       return res;
//     }
//   }

//   if ((token || isAuthenticated) &&
//     (pathname === "/login" || pathname === "/signup")) {
//     return NextResponse.redirect(new URL("/dashboard", req.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/((?!_next/static|_next/image|favicon.ico|api|.*\\..*).*)",
//   ],
// };

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  console.log("MIDDLEWARE HIT:", req.nextUrl.pathname);
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};