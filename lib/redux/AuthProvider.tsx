"use client";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/lib/redux/Features/authSlice";
import { useSession, SessionProvider } from "next-auth/react"; // ← SessionProvider add karo
import toast from "react-hot-toast";

function AuthSync({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const { data: session, status } = useSession();
  const toastShown = useRef(false);

  useEffect(() => {
    if (status === "authenticated" && session && !toastShown.current) {
      toastShown.current = true;
      dispatch(loginSuccess());
      toast.success(`Welcome back, ${session.user?.name?.split(" ")[0]}! 👋`, {
        style: {
          background: "#1e293b",
          color: "#fff",
          fontWeight: "bold",
          borderRadius: "12px",
        },
        iconTheme: {
          primary: "#6366f1",
          secondary: "#fff",
        },
      });
    }
  }, [session, status, dispatch]);

  return <>{children}</>;
}

// ← YEH POORA MISSING THA!
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthSync>{children}</AuthSync>
    </SessionProvider>
  );
}