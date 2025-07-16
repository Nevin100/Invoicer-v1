"use client";

import { Provider } from "react-redux";
import { store } from "@/lib/redux/store";
import "./globals.css";
import ClientLayout from "./client-layout";
import AuthGuard from "@/components/AuthGuard";
import { useEffect } from "react";
import Head from "next/head";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  useEffect(() => {
    document.title = "Instant Paid";
  }, []);

  return (
    <html lang="en">
      <Provider store={store}>
        <Head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          <link rel="icon" type="image/png" href="/favicon.png" />
          <link rel="shortcut icon" href="/favicon.ico" />
        </Head>
        <body>
          <ClientLayout>
            <AuthGuard>{children}</AuthGuard>
          </ClientLayout>
        </body>
      </Provider>
    </html>
  );
}
