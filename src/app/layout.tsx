"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import localFont from "next/font/local";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

interface RootLayoutProps {
  children: React.ReactNode;
}

const yekanFont = localFont({
  src: [
    {
      path: "../../public/fonts/IRANYekanX-Regular.woff2",
      weight: "400",
    },
    {
      path: "../../public/fonts/IRANYekanX-Medium.woff2",
      weight: "500",
    },
    {
      path: "../../public/fonts/IRANYekanX-DemiBold.woff2",
      weight: "600",
    },
    {
      path: "../../public/fonts/IRANYekanX-Bold.woff2",
      weight: "700",
    },
  ],
});
export default function RootLayout({ children }: RootLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const pathname = usePathname();

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

  const excludedRoutes = [
    "/not-found",
    "/signup",
    "/login",
    "/resetPassword",
    "/checkEmail",
    "/forgetPassword",
  ];
  const shouldShowSidebar = !excludedRoutes.includes(pathname);

  return (
    <html lang="fa" dir="rtl" className={yekanFont.className}>
      <body>
          <SidebarProvider defaultOpen={!isSidebarCollapsed}>
            {shouldShowSidebar && <AppSidebar />}
            <main className="flex-1 transition-all duration-300 overflow-y-auto">
              {shouldShowSidebar && <SidebarTrigger />}
              {children}
            </main>
          </SidebarProvider>
      </body>
    </html>
  );
}
