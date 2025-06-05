import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "榴莲修仙 - 踏上修真之路",
  description: "一款基于文字的修仙模拟游戏，开启你的修真之旅",
  icons: {
    icon: [{ url: "/durian_logo.svg", type: "image/svg+xml" }],
    apple: [{ url: "/durian_logo.svg" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="icon" href="/durian_logo.svg" type="image/svg+xml" />
      </head>
      <body
        className={`${inter.className} bg-gray-900 text-gray-100 min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
