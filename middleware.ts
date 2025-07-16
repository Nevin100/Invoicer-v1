/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {

  // Public Routes
  const publicRoutes = ["/login", "/signup"];

  // Private Routes
  const privateRoutes = ["/", "/expenses", "/invoices", "/payments", "/reports", "/settings"];

  // // ✅ Agar user private route pe hai aur login nahi hai, toh login page pe redirect karo
  // if (privateRoutes.includes(req.nextUrl.pathname) && !token) {
  //   return NextResponse.redirect(new URL("/login", req.url));
  // }

  // // ✅ Agar user logged in hai aur login ya signup pe ja raha hai, toh home page pe redirect karo
  // if (publicRoutes.includes(req.nextUrl.pathname) && token) {
  //   return NextResponse.redirect(new URL("/", req.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/expenses", "/invoices", "/payments", "/reports", "/settings", "/login", "/signup"],
};


