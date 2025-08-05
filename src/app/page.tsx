"use client";

import { Info, Copy, ShieldCheck, ExternalLink } from "lucide-react";
import { Button } from "@/components/Button";
import Image from "next/image";
import Link from "next/link";
import GoogleLogin from "@/components/googleLogIn";

const connectors = [
  {
    id: "google-drive",
    name: "Google Drive",
    nameFA: "گوگل درایو",
    type: "Integration",
    typeFA: "یکپارچه‌سازی",
    icon: "/logo/icons8-google-drive-96.png",
    isNew: true,
    link: "https://www.google.com/",
  },
  {
    id: "onedrive",
    name: "Microsoft OneDrive",
    nameFA: "مایکروسافت وان‌درایو",
    type: "Integration",
    typeFA: "یکپارچه‌سازی",
    icon: "/logo/icons8-onedrive-96.png",
    isNew: true,
    link: "/chat",
  },
  {
    id: "onedrive-business",
    name: "OneDrive for Business",
    nameFA: "گوگل شیت",
    type: "Integration",
    typeFA: "یکپارچه‌سازی",
    icon: "/logo/sheets.png",
    isNew: true,
    link: "",
  },
  {
    id: "google-ads",
    name: "Google Ads",
    nameFA: "تبلیغات گوگل",
    type: "Integration",
    typeFA: "یکپارچه‌سازی",
    icon: "/logo/icons8-google-ads-96.png",
    isNew: true,
    link: "",
  },
  {
    id: "postgres",
    name: "Postgres",
    nameFA: "پست‌گرس",
    type: "Database",
    typeFA: "پایگاه داده",
    icon: "/logo/icons8-postgres-96.png",
    isNew: false,
    link: "",
  },
  {
    id: "bigquery",
    name: "BigQuery",
    nameFA: "بیگ‌کوئری",
    type: "Database",
    typeFA: "پایگاه داده",
    icon: "/logo/bigquery-svgrepo-com.svg",
    isNew: false,
    link: "",
  },
  {
    id: "supabase",
    name: "Supabase",
    nameFA: "سوپابیس",
    type: "Database",
    typeFA: "پایگاه داده",
    icon: "/logo/icons8-supabase-96.png",
    isNew: false,
    link: "",
  },
  {
    id: "snowflake",
    name: "Snowflake",
    nameFA: "اسنوفلیک",
    type: "Database",
    typeFA: "پایگاه داده",
    icon: "/logo/snowflake-color.png",
    isNew: false,
    link: "",
  },
  {
    id: "mcp",
    name: "MCP",
    nameFA: "ام‌سی‌پی",
    type: "Protocol",
    typeFA: "پروتکل",
    icon: "/logo/mcp.png",
    isNew: false,
    link: "",
  },
];

export default function Connectors() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="border-b border-slate-200 pb-6 mb-6">
          <h1 className="text-2xl font-semibold mb-2">
            اتصال‌دهنده‌های داده و MCPها
          </h1>
          <p className="text-slate-500">
            می‌توانید Julius را به انبارهای داده و ابزارهای کسب‌وکار خود در
            اینجا متصل کنید
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* IP Whitelist Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                  <Info className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-blue-800 text-sm font-semibold mb-1">
                  آدرس IP را برای اتصالات پایگاه داده مجاز کنید
                </h3>
                <p className="text-blue-700 text-sm mb-3">
                  اگر پایگاه داده شما نیاز به مجاز کردن IP دارد، این آدرس IP را
                  به اتصالات مجاز خود اضافه کنید:
                </p>
                <div className="bg-white/70 border border-blue-200 rounded-lg p-3 flex items-center gap-3">
                  <code className="bg-blue-50 text-blue-800 text-sm font-mono px-2 py-1 rounded flex-1">
                    35.225.57.12, 35.202.28.218, 35.184.233.185
                  </code>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-blue-700 hover:text-blue-800 px-3"
                    onClick={() =>
                      copyToClipboard(
                        "35.225.57.12, 35.202.28.218, 35.184.233.185"
                      )
                    }
                  >
                    <Copy className="w-4 h-4 ml-1" />
                    کپی
                  </Button>
                </div>
                <p className="text-blue-700 text-xs mt-2">
                  این آدرس IP به‌طور خودکار زمانی که زیرساخت ما تغییر می‌کند،
                  به‌روزرسانی می‌شود.
                </p>
              </div>
            </div>
          </div>

          {/* My Connections Section */}
          <div className="bg-white border border-slate-200 rounded-2xl mb-10">
            <div className="text-center py-8">
              <h1 className="text-2xl font-medium mb-5">اتصالات من</h1>
              <div className="text-slate-500 py-8">
                <p className="text-lg font-medium mb-2">
                  هنوز اتصالی وجود ندارد
                </p>
                <p className="text-sm">
                  اولین منبع داده خود را برای شروع متصل کنید
                </p>
              </div>
            </div>
          </div>

          {/* Browse All Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">مرور همه</h2>

            {/* Connectors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {connectors.map((connector) => (
                <div
                  key={connector.id}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Image
                          src={connector.icon}
                          alt={connector.nameFA}
                          width={40}
                          height={40}
                          className="object-contain flex-shrink-0"
                        />
                        <div>
                          <h3 className="text-sm font-medium tracking-tight">
                            {connector.nameFA}
                          </h3>
                          <p className="text-xs text-slate-500 tracking-tight">
                            {connector.typeFA}
                          </p>
                        </div>
                      </div>
                      {connector.isNew && (
                        <div className="bg-blue-50 text-blue-600 text-xs font-medium px-2 py-1 rounded">
                          جدید
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="bg-slate-50 border-t border-slate-200 px-4 py-3">
                    <Link href={connector.link}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs font-medium h-8"
                      >
                        اتصال
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}

              {/* Request Connector Card */}
              <a
                href="https://juliusai.typeform.com/to/sNGPR8nP"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="p-4">
                  <div className="space-y-2">
                    <div>
                      <h3 className="text-sm font-medium tracking-tight">
                        اتصال دیگری نیاز دارید؟
                      </h3>
                      <p className="text-xs text-slate-500 tracking-tight">
                        به ما بگویید چه داده‌ای را می‌خواهید در Julius استفاده
                        کنید
                      </p>
                    </div>
                    <span className="inline-flex items-center justify-center h-8 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium w-fit">
                      درخواست اتصال‌دهنده
                    </span>
                  </div>
                </div>
              </a>
            </div>
          </div>
                  <GoogleLogin />

          {/* Footer */}
          <div className="flex items-center gap-4 justify-center pt-8">
            <div className="flex items-center gap-1 bg-slate-100 rounded-md px-2 py-1">
              <ShieldCheck className="w-6 h-6 text-slate-600" />
              <p className="text-sm font-semibold text-slate-500">
                دارای گواهی SOC 2 Type 2
              </p>
            </div>
            <a
              href="#"
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
            >
              <span className="text-sm">مرکز امنیت و اعتماد</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
