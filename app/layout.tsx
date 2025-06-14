"use client"
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/modules/common/ui/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <ClerkProvider afterSignOutUrl={"/sign-in"} appearance={{
      elements: {
        formButtonPrimary: "bg-primary hover:bg-primary/90 text-sm !shadow-none"
      }
    }}>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <QueryClientProvider client={queryClient}>
            <NextTopLoader color="#10b981" showSpinner={false}/>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
            <ReactQueryDevtools />
          </QueryClientProvider>
        </body>
        <Toaster richColors />
      </html>
    </ClerkProvider>
  );
}
