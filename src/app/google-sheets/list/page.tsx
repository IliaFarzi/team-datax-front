"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Sheet {
  sheet_id: string;
  sheet_name: string;
  file_url: string;
}

export default function SheetsList() {
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSheets = async () => {
      try {
        const token = Cookies.get("access_token");
        console.log("Access token for sheets:", token); // لاگ برای دیباگ
        if (!token) {
          setErrorMessage(
            "برای مشاهده شیت‌ها، ابتدا وارد حساب کاربری خود شوید."
          );
          router.push("/login");
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/sheets`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          let errorDetail = "خطا در دریافت لیست شیت‌ها";
          if (response.status === 401) {
            errorDetail = "توکن نامعتبر است. لطفاً دوباره وارد شوید.";
            Cookies.remove("access_token");
            router.push("/login");
          } else if (response.status === 500) {
            errorDetail =
              "خطای سرور رخ داده است. لطفاً بعداً دوباره امتحان کنید.";
            try {
              const result = await response.json();
              errorDetail = result.detail || errorDetail;
              console.error("Server error details:", result); // لاگ جزئیات خطا
            } catch (jsonError) {
              console.error("JSON parse error:", jsonError);
            }
          } else {
            try {
              const result = await response.json();
              errorDetail = result.detail || errorDetail;
            } catch (jsonError) {
              console.error("JSON parse error:", jsonError);
            }
          }
          throw new Error(errorDetail);
        }

        const result = await response.json();
        console.log("Sheets response:", result); // لاگ برای دیباگ
        setSheets(result.uploaded || []);
      } catch (error: unknown) {
        const errorMsg =
          error instanceof Error ? error.message : "خطا در دریافت لیست شیت‌ها";
        setErrorMessage(errorMsg);
        console.error("Fetch sheets error:", errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchSheets();
  }, [router]);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto px-6 py-6">
        <div className="border-b border-slate-200 pb-1 mb-6">
          <h1 className="text-[24px] flex justify-end md:justify-start font-semibold">
            لیست شیت‌ها
          </h1>
          <h2 className="hidden md:block text-[#71717A] text-[14px]">
            شیت‌های ذخیره‌شده گوگل شما
          </h2>
        </div>

        {loading ? (
          <div className="text-center">در حال بارگذاری...</div>
        ) : errorMessage ? (
          <div className="text-red-500 text-center">{errorMessage}</div>
        ) : sheets.length === 0 ? (
          <div className="text-center">هیچ شیتی یافت نشد</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {sheets.map((sheet) => (
              <div
                key={sheet.sheet_id}
                className="bg-white max-w-[312px] border border-slate-200 rounded-xl p-3"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src="/images/googleSheet.png"
                    alt="Google Sheet"
                    width={40}
                    height={40}
                  />
                  <div>
                    <h3 className="font-medium tracking-tight">
                      {sheet.sheet_name}
                    </h3>
                    <a
                      href={sheet.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-500"
                    >
                      مشاهده فایل
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
