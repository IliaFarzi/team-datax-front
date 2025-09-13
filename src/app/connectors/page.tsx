"use client";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";

type Connector = {
  id: string;
  name: string;
  nameFA: string;
  type: string;
  typeFA: string;
  icon: string;
  isNew?: boolean;
};

const connectors: Connector[] = [
  {
    id: "google-sheets",
    name: "Google Sheets",
    nameFA: "گوگل شیت",
    type: "Integration",
    typeFA: "جدول‌های گوگل شیت خود را تحلیل کنید.",
    icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAhCAYAAACvBDmYAAAAAXNSR0IArs4c6QAAAYxJREFUWEdjZMABTJYHFv5nYGxnZGRkx6WG+uL/DvxnZGw6G75uP7rZjNgsM1kRuJ+BgcmB+g4hzsT/jP+d0B2L4VCVSZ7sAmJcP4gzkjaq/v3/f/Bc5DqUgMJwqPHywBJGRqZuYpxgLKbNYCSqDVd67vVVhrOvrhKjlaCaMxFrUdyG4VCT5UENDIyM9QRNYmBgSNUOY0jTCYMrnXVlFcPsq6uI0UpQzahDQUE0GqIMDAyjaZRgbiGgYPhmplgNf4Y8/VhKA4igfvSMSHKIjjoULYwpDlFbKRMGD3lbrFGnzC/LoMwvB5e7+/ERw92PjwlGMzYF+56cYNj7+DhciuSox2fraBXKwMAwGqKjdT00k4zW9WSVUUiaRjPTaGYazUyjvVC0cmRY9uv1RNQZ9EU04F69+OYGw6U3NyktQsH6CZajBksDDFiYmc9TxTZyDfnP8O1M5FpuZO3YR/OWBx1jYGS0JNceSvX9Z2AoPhuxto8Ih4Y4/Gf4387IyGBBqaWk6/934EzEekd0fQBul0Ax/Nn2agAAAABJRU5ErkJggg==",
    isNew: true,
  },
];

function ConnectorsContent() {
  const [isConnected, setIsConnected] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const success = searchParams.get("success");
    const token = Cookies.get("access_token");

    console.log("Checking access_token in cookies:", token);

    if (token) {
      setIsLoggedIn(true);
    }

    if (success) {
      setIsConnected(true);
      Cookies.set("google_sheets_connected", "true", {
        expires: 7,
        secure: false,
        sameSite: "Lax",
        path: "/",
      });
    } else {
      const connected = Cookies.get("google_sheets_connected");
      if (connected === "true") {
        setIsConnected(true);
      }
    }
  }, [searchParams]);

  const handleConnect = useCallback(async () => {
    try {
      const token = Cookies.get("access_token");
      console.log("Access token for request:", token);

      if (!token) {
        setErrorMessage("برای اتصال، ابتدا وارد حساب کاربری خود شوید.");
        router.push("/login");
        return;
      }

      const base = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(
        /\/$/,
        ""
      );
      const response = await fetch(`${base}/auth/connect-google-sheets`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        let errorDetail = "خطا در دریافت آدرس اتصال گوگل";
        if (response.status === 401) {
          errorDetail = "توکن نامعتبر است. لطفاً دوباره وارد شوید.";
          Cookies.remove("access_token");
          router.push("/login");
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

      const { auth_url } = await response.json();
      if (!auth_url) {
        throw new Error("آدرس تأیید گوگل دریافت نشد");
      }

      console.log("Redirecting to auth_url:", auth_url);
      window.location.href = auth_url;
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "خطا در شروع فرایند اتصال";
      setErrorMessage(errorMsg);
      console.error("Failed to start connection flow:", err);
    }
  }, [router]);

  const handleLoginCheck = () => {
    const token = Cookies.get("access_token");
    console.log("Manual login check - access_token:", token);
    if (token) {
      setIsLoggedIn(true);
      setErrorMessage(null);
    } else {
      setErrorMessage("لطفاً وارد حساب کاربری خود شوید.");
      router.push("/login");
    }
  };

  return (
    <div className="w-auto mx-auto">
      <div className="space-y-4 md:mr-26">
        {errorMessage && (
          <div className="text-red-500 text-center mb-4">
            {errorMessage}
            {!isLoggedIn && (
              <button
                onClick={handleLoginCheck}
                className="ml-2 text-blue-500 underline"
              >
                بررسی دوباره وضعیت ورود
              </button>
            )}
          </div>
        )}
        <h2 className="text-xl font-semibold tracking-tight">افزودن اتصالات</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {connectors.map((connector) => (
            <button
              key={connector.id}
              onClick={handleConnect}
              className="text-right bg-white max-w-[312px] border border-slate-200 rounded-xl overflow-hidden p-0"
              type="button"
            >
              <div className="pr-3 pb-3 justify-between h-[108px] flex">
                <div className="flex items-center gap-3">
                  <Image
                    src={connector.icon}
                    alt={connector.nameFA}
                    width={50}
                    height={50}
                    className={`${isConnected ? "mb-8" : ""}`}
                  />
                  <div>
                    <h3 className="font-medium tracking-tight">
                      {connector.nameFA}
                    </h3>
                    <p className="text-xs text-[#09090B] tracking-tight">
                      {connector.typeFA}
                    </p>
                    {isConnected && (
                      <p className="text-xs text-[#047857] bg-[#0596691A] w-fit rounded-md px-2 py-0.5 mt-5 font-medium">
                        متصل
                      </p>
                    )}
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
  );
}

export default function Connectors() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto px-6 py-6">
        <div className="border-b border-slate-200 pb-1 mb-6">
          <h1 className="text-[24px] flex justify-end md:justify-start font-semibold">
            اتصالات داده
          </h1>
          <h2 className="hidden md:block text-[#71717A] text-[14px]">
            دیتاکس را به نرم‌افزارها و اطلاعات‌تان متصل کنید
          </h2>
        </div>

        <Suspense fallback={<div>در حال بارگذاری...</div>}>
          <ConnectorsContent />
        </Suspense>
      </div>
    </div>
  );
}
