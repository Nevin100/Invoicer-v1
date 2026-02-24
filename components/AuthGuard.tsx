/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname(); 
  const token = useSelector((state: any) => state.auth.token);

  useEffect(() => {
    const publicRoutes = ["/login", "/signup",];
    const privateRoutes = ["/dashboard", "/expenses", "/invoices", "/payments", "/reports", "/settings"];

    if (!token && privateRoutes.includes(pathname)) {
      router.push("/login");
    }

    if (token && publicRoutes.includes(pathname)) {
      router.push("/dashboard");
    }
  }, [token, pathname, router]);

  return <>{children}</>;
}
