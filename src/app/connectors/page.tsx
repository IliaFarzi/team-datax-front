"use client";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useCallback } from "react";

type Connector = {
  id: string;
  name: string;
  nameFA: string;
  type: string;
  typeFA: string;
  icon: string;
  isNew?: boolean;
  link?: string;
};

const connectors: Connector[] = [
  {
    id: "google-sheets",
    name: "Google Sheets",
    nameFA: "گوگل شیت",
    type: "Integration",
    typeFA: "جدول‌های گوگل شیت خود را تحلیل کنید.",
    icon: "/images/googleSheet.png",
    isNew: true,
  },
];

export default function Connectors() {
  const handleConnect = useCallback(async (connectorId: string) => {
    try {
      const base =
        (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "") || "";
      // هدایت مستقیم به بک‌اند برای شروع جریان اتصال Google Sheets
      window.location.href = `${base}/auth/connect-google-sheets`;
    } catch (err) {
      console.error("Failed to start connection flow:", err);
      alert("خطا در شروع فرایند اتصال. کنسول را بررسی کنید.");
    }
  }, []);

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="border-b border-slate-200 pb-6 mb-6">
          <h1 className="text-2xl font-semibold mb-2">
            اتصال‌دهنده‌های داده و MCPها
          </h1>
          <p className="text-slate-500">
            دیتاکس را به نرم‌افزارها و اطلاعات‌تان متصل کنید
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">
              افزودن اتصالات
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {connectors.map((connector) => (
                <button
                  key={connector.id}
                  onClick={() => handleConnect(connector.id)}
                  className="text-right bg-white border border-slate-200 rounded-xl overflow-hidden p-0"
                  type="button"
                >
                  <div className="p-4 w-[312px] h-[108px] border border-[#E4E4E7] flex flex-col items-start justify-between">
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
                        <p className="text-xs text-[#09090B] tracking-tight">
                          {connector.typeFA}
                        </p>
                      </div>
                    </div>

                    <div className="self-end w-10 h-8 bg-black flex justify-center items-center rounded-lg ml-3">
                      <ArrowLeft color="white" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
