"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import Cookies from "js-cookie";

type Sheet = {
  id: string;
  name: string;
  csvLink: string;
  csvData?: Record<string, string>[];
};

export default function Spreadsheet() {
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

        if (!data || data.length === 0) {
          router.push("/connectors");
          return;
        }

        const sheetsWithData = await Promise.all(
          data.map(async (sheet: Sheet) => {
            try {
              const csvResponse = await fetch(sheet.csvLink);
              if (!csvResponse.ok) {
                throw new Error(`Failed to fetch CSV for ${sheet.name}`);
              }
              const csvText = await csvResponse.text();
              const parsed = Papa.parse<Record<string, string>>(csvText, {
                header: true,
                skipEmptyLines: true,
              });
              return { ...sheet, csvData: parsed.data };
            } catch (err) {
              console.error(`Error parsing CSV for ${sheet.name}:`, err);
              return sheet; 
            }
          })
        );

        setSheets(sheetsWithData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching sheets:", err);
        setError("خطا در دریافت لیست شیت‌ها. لطفاً دوباره تلاش کنید.");
        setLoading(false);
        router.push("/connectors");
      }
    };

    fetchSheets();
  }, [router]);

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
          <h1 className="text-2xl font-semibold mb-2">گوگل شیت‌های شما</h1>
          <p className="text-slate-500">لیست شیت‌های متصل‌شده و محتوای آنها</p>
        </div>

        <div className="max-w-4xl mx-auto">
          {sheets.length === 0 ? (
            <p className="text-slate-500">هیچ شیتی یافت نشد.</p>
          ) : (
            <ul className="space-y-4">
              {sheets.map((sheet) => (
                <li
                  key={sheet.id}
                  className="p-4 border border-slate-200 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span>{sheet.name}</span>
                    <a
                      href={sheet.csvLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      دانلود CSV
                    </a>
                  </div>
                  {sheet.csvData && sheet.csvData.length > 0 ? (
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          {Object.keys(sheet.csvData[0]).map((header) => (
                            <th
                              key={header}
                              className="border p-2 text-right bg-slate-100"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sheet.csvData.map((row, index) => (
                          <tr key={index}>
                            {Object.values(row).map((value, i) => (
                              <td key={i} className="border p-2 text-right">
                                {String(value)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-slate-500">
                      داده‌ای برای نمایش موجود نیست.
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
          <button
            onClick={() => router.push("/connectors")}
            className="mt-6 px-4 py-2 bg-black text-white rounded-lg"
          >
            افزودن اتصال جدید
          </button>
        </div>
      </div>
    </div>
  );
}
