import type { Metadata } from "next";
import { AuthProvider } from "@/lib/authContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 智创平台",
  description: "光速构建 AI 应用",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body
        className={`antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
