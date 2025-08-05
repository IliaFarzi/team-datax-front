"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/sidebar";
import { SessionProvider } from "next-auth/react";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  const excludedRoutes = ["/login", "/signup", "/not-found"]; //here U can add urls that u want to don not have sidebar
  const shouldShowSidebar = !excludedRoutes.includes(pathname);

  return (
    <html lang="fa" dir="rtl">
      <body className={`${vazirmatn.variable}`}>
        <SessionProvider>
          <div className="min-h-screen">
            {shouldShowSidebar && (
              <Sidebar
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={() =>
                  setIsSidebarCollapsed(!isSidebarCollapsed)
                }
              />
            )}
            <main
              className={`flex-1 transition-all duration-300 ${
                shouldShowSidebar
                  ? isSidebarCollapsed
                    ? "md:mr-12"
                    : "md:mr-[265px]"
                  : ""
              }`}
            >
              {children}
            </main>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
