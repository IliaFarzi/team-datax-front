"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

export default function Callback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const exchangeCode = async () => {
      const code = searchParams.get("code");
      const state = searchParams.get("state");
      console.log("Google callback params:", { code, state });

      if (!code) {
        setErrorMessage("کد تأیید گوگل یافت نشد");
        return;
      }

      try {
        const token = Cookies.get("access_token");
        console.log("Access token for exchange:", token); // لاگ برای دیباگ
        if (!token) {
          setErrorMessage("برای ادامه، ابتدا وارد حساب کاربری خود شوید.");
          router.push("/login");
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google-sheets/exchange`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ code }), 
          }
        );

        if (!response.ok) {
          let errorDetail = "خطا در تبادل کد گوگل";
          if (response.status === 401) {
            errorDetail = "توکن نامعتبر است. لطفاً دوباره وارد شوید.";
            Cookies.remove("access_token");
            router.push("/login");
          } else if (response.status === 500) {
            errorDetail =
              "خطای سرور رخ داده است. لطفاً با پشتیبانی تماس بگیرید.";
            try {
              const result = await response.json();
              errorDetail = result.detail || errorDetail;
              console.error("Server error details:", result);
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
        console.log("Exchange response:", result);

        router.push("/connectors?success=true");
      } catch (error: unknown) {
        const errorMsg =
          error instanceof Error ? error.message : "خطا در تبادل کد گوگل";
        setErrorMessage(errorMsg);
        console.error("Exchange error:", errorMsg);
      }
    };

    exchangeCode();
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      {errorMessage ? (
        <div className="text-red-500 text-center">{errorMessage}</div>
      ) : (
        <div className="text-center">در حال پردازش اتصال به گوگل شیت...</div>
      )}
    </div>
  );
}
