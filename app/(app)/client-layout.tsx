"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import TopProgressBar from "@/components/TopProgressBar";
import { useRouter } from "next/navigation";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isAuthPage = pathname === "/login" || pathname === "/signup";
  const isFullWidthPage = pathname === "/invoices/create-invoice";

  const isProfileSetup = pathname === "/profile/setup"; // ← add karo

  useEffect(() => {
    if (isAuthPage || isProfileSetup) return;

    fetch("/api/profile", { credentials: "include" })
      .then(r => r.json())
      .then(d => {
        if (!d.profile || !d.profile.isComplete) {
          router.push("/profile/setup");
        }
      })
      .catch(() => {}); 
  }, [pathname]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      window.dispatchEvent(new Event("topbar-stop"));
    }, 400);

    return () => clearTimeout(timeout);
  }, [pathname]);

  useEffect(() => {
    if (isSidebarOpen && typeof window !== "undefined" && window.innerWidth < 768) {
      const timeout = setTimeout(() => {
        setIsSidebarOpen(false);
      }, 2500);

      return () => clearTimeout(timeout); 
    }
  }, [isSidebarOpen]);

  return (
    <div className="flex h-screen">
      <TopProgressBar />

      {!isAuthPage && !isFullWidthPage && (
        <>
          <div className="w-[250px] hidden md:block">
            <Sidebar />
          </div>

          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black opacity-50 md:hidden z-40"
              onClick={() => setIsSidebarOpen(false)}
            ></div>
          )}

          <div
            className={`fixed top-0 left-0 h-full w-[250px] bg-white border-r border-gray-200 transform ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } transition-transform md:hidden z-50 shadow-lg`}
          >
            <Sidebar />
          </div>
        </>
      )}

      <div className="bg-gray-100 flex-1 flex flex-col">
        {!isAuthPage && <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />}

        <div
          className={`flex-1 overflow-y-auto p-4 ${
            isFullWidthPage ? "w-full max-w-none" : "md:mt-2"
          }`}
          onClick={() => isSidebarOpen && setIsSidebarOpen(false)}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
