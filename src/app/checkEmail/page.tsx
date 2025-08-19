"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

type ErrorDetailItem = {
  msg?: string;
  message?: string;
  [key: string]: unknown;
};

type ApiErrorResponse = {
  detail?: string | ErrorDetailItem[];
  email?: string;
  status?: string;
};

const CheckEmail = () => {
  const [code, setCode] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async () => {
    console.log("Submitting code:", code);
    setErrorMessage(null);

    if (code.length !== 6) {
      setErrorMessage("کد باید ۶ رقم باشد");
      console.error("Invalid code length:", code);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verify`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
          credentials: "include",
          redirect: "manual",
        }
      );

      console.log("API response status:", response.status);

      if (response.status === 302) {
        const redirectUrl = response.headers.get("Location");
        console.log("Server sent 302 Location:", redirectUrl);

        if (redirectUrl) {
          try {
            const parsed = new URL(redirectUrl, window.location.origin);
            const status = parsed.searchParams.get("status");
            console.log("Parsed redirect status:", status);
            if (status === "success") {
              // مسیر اصلی
              router.push("/");
              return;
            } else {
              router.push(redirectUrl);
              return;
            }
          } catch (e) {
            console.warn("Could not parse redirect URL, pushing raw:", e);
            router.push(redirectUrl);
            return;
          }
        }
      }

      // --- error ---
      if (!response.ok) {
        let errorDetail = "Verification failed";
        try {
          const result: ApiErrorResponse = await response.json();
          console.log("API error response body:", result);
          errorDetail =
            typeof result.detail === "string"
              ? result.detail
              : Array.isArray(result.detail)
              ? result.detail
                  .map((err: ErrorDetailItem) => err.msg ?? err.message ?? "")
                  .filter(Boolean)
                  .join(", ") || errorDetail
              : errorDetail;
        } catch (jsonError) {
          console.error("JSON parse error on error response:", jsonError);
        }
        throw new Error(errorDetail);
      }

      const result: ApiErrorResponse = await response.json();
      console.log("Verification success response JSON:", result);

      // اگر سرور داخل JSON وضعیت موفق داده باشه یا ایمیل برگردونده، مستقیم بفرست به صفحه اصلی
      if (result.status === "success" || result.email) {
        router.push("/");
        return;
      }

      router.push(
        `/auth/verify-callback?status=success&email=${encodeURIComponent(
          result.email ?? ""
        )}`
      );
    } catch (error: unknown) {
      const errorMsg =
        error instanceof Error ? error.message : "Verification failed";
      setErrorMessage(errorMsg);
      console.error("Verification error:", errorMsg);
    }
  };

  return (
    <div className="">
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-sm border-none">
          <CardHeader>
            <div className="flex flex-col items-center justify-center">
              {/* svg + title */}
              <svg
                width="52"
                height="52"
                viewBox="0 0 52 52"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M27.914 8C34.0825 8.84853 38.7328 11.9488 41.8647 17.3005C44.8173 23.2979 44.7078 29.2429 41.5365 35.1356C38.2774 40.3136 33.5907 43.2315 27.4763 43.889C24.9962 43.889 22.5161 43.889 20.0359 43.889C20.0359 39.9499 20.0359 36.0109 20.0359 32.0719C24.0301 32.1082 28.0056 32.0716 31.9624 31.9625C31.9624 27.9504 31.9624 23.9385 31.9624 19.9265C27.9504 19.9265 23.9385 19.9265 19.9265 19.9265C19.8173 23.8834 19.7808 27.8589 19.8171 31.853C15.8781 31.853 11.939 31.853 8 31.853C8 23.902 8 15.951 8 8C14.638 8 21.276 8 27.914 8Z"
                  fill="#010101"
                />
              </svg>

              <CardTitle className="font-semibold text-[20px]">
                اعتبارسنجی ایمیل
              </CardTitle>
              <div className="flex gap-1 text-[14px] text-center">
                کد ۶ رقمی ارسال شده به ایمیل m@example.com را وارد کنید
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex flex-col justify-center items-center">
            <InputOTP
              maxLength={6}
              value={code}
              onChange={(val) => {
                setCode(val);
                console.log("Current OTP value:", val);
              }}
              className="mx-auto"
            >
              <InputOTPGroup>
                <InputOTPSlot index={5} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
              <InputOTPGroup>
                <InputOTPSlot index={2} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={0} />
              </InputOTPGroup>
            </InputOTP>

            <div className="flex gap-6 mt-3 text-[14px]">
              <h3 className="cursor-pointer">ارسال مجدد کد</h3>
              <Link href={"/signup"}>
                <h3 className="cursor-pointer">ویرایش ایمیل</h3>
              </Link>
            </div>
            {errorMessage && (
              <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
            )}
          </CardContent>

          <CardFooter className="flex-col gap-1 ">
            <Button
              onClick={onSubmit}
              className="w-[340px] h-10 text-base font-medium"
            >
              اعتبارسنجی
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CheckEmail;
