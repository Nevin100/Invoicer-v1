import type { Metadata } from "next";
import ReduxProvider from "@/lib/redux/ReduxProvider";
import "./globals.css";
import AuthProvider from "@/lib/redux/AuthProvider";
import {Toaster} from "react-hot-toast";

export const metadata: Metadata = {
  title: {
    default: "Invoicer — Smart Invoicing for Everyone",
    template: "%s | Invoicer",
  },
  description:
    "Create, manage, and track professional invoices powered by AI. Built for freelancers, agencies, and growing businesses.",
  keywords: ["invoice", "invoicing", "AI invoice", "billing", "SaaS"],
  authors: [{ name: "Nevin Bali" }],
  metadataBase: new URL("https://www.nevinbali.me"),
  openGraph: {
    title: "Invoicer — Smart Invoicing for Modern Teams",
    description: "AI-powered invoicing platform for modern businesses.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Toaster />
        <ReduxProvider>
          <AuthProvider>{children}</AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
