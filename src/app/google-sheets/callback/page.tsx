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
      Cookies.set("google_sheets_code", code, {
        expires: 7,
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

      Cookies.set("google_sheets_connected", "true", {
        expires: 7,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });

      router.push("/google-sheets/list");
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
