"use client";
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
    typeFA: "یکپارچه‌سازی",
    icon: "/logo/sheets.png",
    isNew: true,
  },
];

export default function Connectors() {
  const handleConnect = useCallback(async (connectorId: string) => {
    try {
      const base =
        (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "") || "";
      const callbackUrl = `${window.location.origin}/auth/callback`; // صفحه callback ما (پایین میفرستم)
      const loginUrl = `${base}/auth/login?callbackUrl=${encodeURIComponent(
        callbackUrl
      )}`;

      // اگر می‌خواهید قبل از redirect بررسی کنید که کاربر قبلاً session داره:
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("access_token")
          : null;
      if (token) {
        // نمونهٔ درخواست اعتبارسنجی توکن (بک‌اند باید endpoint مناسب داشته باشه)
        // اگر بک‌اند چنین endpoint‌ای نداره می‌تونید این بخش رو حذف کنید و مستقیم redirect کنید.
        try {
          const res = await fetch(`${base}/auth/validate`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (res.ok) {
            // اگر توکن معتبره، مستقیم بفرست به صفحه‌ی چت
            window.location.href = "/chat";
            return;
          }
        } catch (e) {
          // در صورتی که validate وجود نداره یا خطا شد، ادامه میدیم به redirect به /auth/login
          console.warn(
            "validate failed or not available, continuing to login flow",
            e
          );
        }
      }

      // هدایت به بک‌اند تا جریان OAuth را شروع کند
      window.location.href = loginUrl;
    } catch (err) {
      console.error("Failed to start OAuth flow:", err);
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
                  className="text-right bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow p-0"
                  type="button"
                >
                  <div className="p-4 w-full flex items-start justify-between">
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
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
