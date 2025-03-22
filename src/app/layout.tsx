import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import QueryProvider from "../context/QueryProvider";
import { AuthProvider } from '@/context/AuthContext';
import { CommonProvider } from "@/context/CommonContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "DeapVision",
  description: "as",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <QueryProvider>
          <CommonProvider>
              <AuthProvider>  
                  {children}
              </AuthProvider>
          </CommonProvider>
          </QueryProvider>
      </body>
    </html>
  );
}
