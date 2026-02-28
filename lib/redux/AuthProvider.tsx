// lib/redux/AuthProvider.tsx
"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/lib/redux/Features/authSlice";
import { useSession, SessionProvider } from "next-auth/react";

function AuthSync({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session) {
      dispatch(loginSuccess());
    }
  }, [session, status, dispatch]);

  return <>{children}</>;
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthSync>{children}</AuthSync>
    </SessionProvider>
  );
}