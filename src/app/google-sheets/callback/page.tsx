"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Cookies from "js-cookie";

function SheetsCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (code) {
      // ذخیره code یا state اگه نیازه (اختیاری)
      Cookies.set("google_sheets_code", code, {
        expires: 1, // 1 روز اعتبار
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });
      if (state) {
        Cookies.set("google_sheets_state", state, {
          expires: 1,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Strict",
        });
      }

      // ذخیره وضعیت اتصال در کوکی
      Cookies.set("google_sheets_connected", "true", {
        expires: 7, // 7 روز اعتبار (یا هر مدت که مناسب می‌دونی)
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });

      // ریدایرکت به صفحه connectors با پارامتر success
      router.push("/connectors?success=true");
    } else {
      console.error("No code provided in URL");
      alert("کد احراز هویت یافت نشد.");
      router.push("/connectors");
    }
  }, [searchParams, router]);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-white"
      dir="rtl"
    >
      <p>در حال پردازش اتصال به گوگل شیت...</p>
    </div>
  );
}

export default function SheetsCallback() {
  return (
    <Suspense fallback={<div>در حال بارگذاری...</div>}>
      <SheetsCallbackHandler />
    </Suspense>
  );
}
