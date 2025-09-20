import type { Metadata } from "next";
import { TooltipProvider } from "@/components/ui/tooltip";
import localFont from "next/font/local";
import "./globals.css";
import ClientLayout from "./ClientLayout";

const yekanFont = localFont({
  src: [
    { path: "../../public/fonts/IRANYekanX-Regular.woff2", weight: "400" },
    { path: "../../public/fonts/IRANYekanX-Medium.woff2", weight: "500" },
    { path: "../../public/fonts/IRANYekanX-DemiBold.woff2", weight: "600" },
    { path: "../../public/fonts/IRANYekanX-Bold.woff2", weight: "700" },
  ],
});

export const metadata: Metadata = {
  title: "DataX – چت‌بات هوش مصنوعی برای آنالیز داده‌ها",
  description:
    "DataX یک چت‌بات هوش مصنوعی است که با استفاده از یادگیری ماشین و پردازش زبان طبیعی، داده‌های شما را تحلیل می‌کند و بینش‌های ارزشمند ارائه می‌دهد.",
  keywords: [
    "DataX",
    "چت‌بات هوش مصنوعی",
    "آنالیز داده",
    "هوش مصنوعی",
    "دستیار هوشمند",
    "تحلیل داده",
    "پردازش زبان طبیعی",
    "یادگیری ماشین",
    "Business Intelligence",
    "AI Chatbot for Data Analysis",
  ],
  openGraph: {
    type: "website",
    siteName: "DataX",
    locale: "fa_IR",
    url: "https://dataxai.ir/",
    title: "DataX – چت‌بات هوش مصنوعی برای آنالیز داده‌ها",
    description:
      "با DataX داده‌های خود را با کمک هوش مصنوعی تحلیل کنید و تصمیم‌های هوشمندانه‌تری بگیرید.",
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 630,
        alt: "DataX AI Chatbot Preview",
      },
    ],
  },
  authors: [
    {
      name: "Datax Team",
      url: "https://dataxai.ir/",
    },
  ],
  creator: "Datax Team",
  icons: [
    {
      rel: "icon",
      type: "image/png",
      url: "/images/logo.png",
    },
  ],
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={yekanFont.className}
      suppressHydrationWarning
    >
      <body className="h-screen ">
        <TooltipProvider>
          <ClientLayout>{children}</ClientLayout>
        </TooltipProvider>
      </body>
    </html>
  );
}
