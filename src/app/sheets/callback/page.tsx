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
    if (code) {
      fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google-sheets/callback`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("access_token") || ""}`,
          },
          body: JSON.stringify({ code }),
        }
      )
        .then((res) => {
          if (res.ok) {
            return res.json().then((data) => {
              if (data.token) {
                Cookies.set("access_token", data.token, {
                  expires: 7,
                  secure: true,
                  sameSite: "Strict",
                });
              }
              if (data.session_id) {
                Cookies.set("session_id", data.session_id, {
                  expires: 7,
                  secure: true,
                  sameSite: "Strict",
                });
              }
              router.push("/sheets/list");
            });
          } else {
            throw new Error("Failed to process Google Sheets callback");
          }
        })
        .catch((err) => {
          console.error("Error in Google Sheets callback:", err);
          alert("خطا در اتصال به گوگل شیت. لطفاً دوباره تلاش کنید.");
          router.push("/connectors");
        });
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
    <Suspense fallback={<div>loading...</div>}>
      <SheetsCallbackHandler />
    </Suspense>
  );
}
