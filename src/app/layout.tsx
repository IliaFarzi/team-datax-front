"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
// import { AppSidebar } from "@/components/app-sidebar";
import { SessionProvider } from "next-auth/react";
import { AppSidebar } from "@/components/app-sidebar";

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

  const excludedRoutes = ["/not-found", "/signup", "/login"];
  const shouldShowSidebar = !excludedRoutes.includes(pathname);

  return (
    <html lang="fa" dir="rtl">
      <body>
        <SessionProvider>
          <SidebarProvider defaultOpen={!isSidebarCollapsed}>
            {shouldShowSidebar && <AppSidebar />}
            <main className="flex-1 transition-all duration-300 overflow-y-auto">
              {shouldShowSidebar && <SidebarTrigger />}
              {children}
            </main>
          </SidebarProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
