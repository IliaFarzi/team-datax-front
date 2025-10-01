"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
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
    "/",
    "/checkPassword",
  ];
  const shouldShowSidebar = !excludedRoutes.includes(pathname);

  return (
    <SidebarProvider defaultOpen={!isSidebarCollapsed}>
      {shouldShowSidebar && <AppSidebar />}
      <main className="flex-1 md:mr-15 transition-all duration-300 overflow-y-auto">
        {shouldShowSidebar}
        {children}
      </main>
    </SidebarProvider>
  );
}
