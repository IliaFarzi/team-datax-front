import type { Metadata } from "next";

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
    locale: "en_US",
    url: "http://62.60.198.4:8050/",
    title: "DataX AI Chatbot – Smart Data Analysis",
    description:
      "یک چت‌بات هوش مصنوعی برای آنالیز داده‌ها و تصمیم‌گیری هوشمندانه.",
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
      url: "http://62.60.198.4:8050/p",
    },
  ],
  creator: "DataX Team",
  icons: [
    {
      rel: "icon",
      url: "/favicon.ico",
    },
    {
      rel: "apple-touch-icon",
      url: "/apple-touch-icon.png",
    },
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
