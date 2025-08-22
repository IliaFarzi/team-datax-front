"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

type Sheet = {
  id: string;
  name: string;
  csvLink: string;
};

export default function SheetsList() {
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSheets = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/sheets/list`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookies.get("access_token") || ""}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch sheets");
        }
        const data = await response.json();
        setSheets(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching sheets:", err);
        setError("خطا در دریافت لیست شیت‌ها. لطفاً دوباره تلاش کنید.");
        setLoading(false);
      }
    };

    fetchSheets();
  }, []);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-white"
        dir="rtl"
      >
        <p>در حال بارگذاری...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-white"
        dir="rtl"
      >
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => router.push("/connectors")}
            className="mt-4 px-4 py-2 bg-black text-white rounded-lg"
          >
            بازگشت به اتصال‌ها
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="border-b border-slate-200 pb-6 mb-6">
          <h1 className="text-2xl font-semibold mb-2">لیست گوگل شیت‌ها</h1>
          <p className="text-slate-500">لیست شیت‌های متصل‌شده و لینک‌های CSV</p>
        </div>

        <div className="max-w-4xl mx-auto">
          {sheets.length === 0 ? (
            <p className="text-slate-500">هیچ شیتی یافت نشد.</p>
          ) : (
            <ul className="space-y-4">
              {sheets.map((sheet) => (
                <li
                  key={sheet.id}
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
                >
                  <span>{sheet.name}</span>
                  <a
                    href={sheet.csvLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    دانلود CSV
                  </a>
                </li>
              ))}
            </ul>
          )}
          <button
            onClick={() => router.push("/connectors")}
            className="mt-6 px-4 py-2 bg-black text-white rounded-lg"
          >
            بازگشت به اتصال‌ها
          </button>
        </div>
      </div>
    </div>
  );
}
