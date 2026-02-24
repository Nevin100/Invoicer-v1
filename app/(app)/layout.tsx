"use client";

import ClientLayout from "./client-layout";
import AuthGuard from "@/components/AuthGuard";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientLayout>
      <AuthGuard>{children}</AuthGuard>
    </ClientLayout>
  );
}