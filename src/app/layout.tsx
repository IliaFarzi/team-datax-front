"use client";

import { useState, useEffect } from "react";
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

  // تشخیص حالت موبایل
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarCollapsed(true);
      } else {
        setIsSidebarCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const excludedRoutes = ["/not-found"];
  const shouldShowSidebar = !excludedRoutes.includes(pathname);

  return (
    <html lang="fa" dir="rtl">
      <body>
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
