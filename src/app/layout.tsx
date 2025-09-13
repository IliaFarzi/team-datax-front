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
    url: "https://datax-ai.vercel.app",
    title: "DataX – چت‌بات هوش مصنوعی برای آنالیز داده‌ها",
    description:
      "با DataX داده‌های خود را با کمک هوش مصنوعی تحلیل کنید و تصمیم‌های هوشمندانه‌تری بگیرید.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "DataX AI Chatbot Preview",
      },
    ],
  },
  authors: [
    {
      name: "DataX Team",
      url: "https://datax-ai.vercel.app",
    },
  ],
  creator: "DataX Team",
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    { rel: "apple-touch-icon", url: "/apple-touch-icon.png" },
    {
      rel: "icon",
      type: "image/png",
      url: "/favicon-32x32.png",
      sizes: "32x32",
    },
    {
      rel: "icon",
      type: "image/png",
      url: "/favicon-16x16.png",
      sizes: "16x16",
    },
    {
      rel: "icon",
      type: "image/png",
      url: "/android-chrome-192x192.png",
      sizes: "192x192",
    },
    {
      rel: "icon",
      type: "image/png",
      url: "/android-chrome-512x512.png",
      sizes: "512x512",
    },
  ],
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/site.webmanifest",
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
      <body className="antialiased">
        <TooltipProvider>
          <ClientLayout>{children}</ClientLayout>
        </TooltipProvider>
      </body>
    </html>
  );
}
