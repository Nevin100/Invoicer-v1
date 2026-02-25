"use client";

import ClientLayout from "./client-layout";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientLayout>
      {children}
    </ClientLayout>
  );
}