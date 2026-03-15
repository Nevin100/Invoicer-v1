"use client";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/lib/redux/Features/authSlice";
import toast from "react-hot-toast";

function AuthSync({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const toastShown = useRef(false);

  useEffect(() => {

    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok && !toastShown.current) {
          const data = await res.json();
          toastShown.current = true;
          dispatch(loginSuccess({
            username: data.user.username,
            email: data.user.email,
            avatar: data.user.avatar || null,
            credits: data.user.credits ?? 200,
            plan: data.user.plan ?? "starter",
          }));
          toast.success(`Welcome back, ${data.user?.username?.split(" ")[0] || "User"}! 👋`, {
            style: {
              background: "#1e293b",
              color: "#fff",
              fontWeight: "bold",
              borderRadius: "12px",
            },
            iconTheme: { primary: "#6366f1", secondary: "#fff" },
          });
        }
      } catch {
      }
    };

    checkAuth();
  }, [dispatch]);

  return <>{children}</>;
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return <AuthSync>{children}</AuthSync>;
}