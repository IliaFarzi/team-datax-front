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

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  // تشخیص حالت موبایل و تنظیم پیش‌فرض سایدبار
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarCollapsed(true); // در موبایل بسته باشد
      } else {
        setIsSidebarCollapsed(false); // در دسکتاپ باز باشد
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
      <body className={`${vazirmatn.variable}`}>
        <SessionProvider>
          <div className="min-h-screen flex">
            {shouldShowSidebar && (
              <Sidebar
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={() =>
                  setIsSidebarCollapsed(!isSidebarCollapsed)
                }
              />
            )}
            <main className="flex-1 transition-all duration-300 overflow-y-auto">
              {children}
            </main>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
