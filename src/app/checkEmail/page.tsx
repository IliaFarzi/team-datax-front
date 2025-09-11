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
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const CheckEmail = () => {
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedEmail = Cookies.get("signup_email");
    if (savedEmail) setEmail(savedEmail);
    else setErrorMessage("ایمیل یافت نشد، دوباره ثبت‌نام کنید");
    console.log("Saved email:", savedEmail);
  }, []);

  const onSubmit = async () => {
    try {
      const token = Cookies.get("access_token");
      if (!token || token === "undefined") {
        throw new Error("توکن معتبر یافت نشد، دوباره ثبت‌نام کنید");
      }

      if (code.length !== 6) {
        setErrorMessage("کد ۶ رقمی را وارد کنید");
        return;
      }

      console.log("API Base URL:", process.env.NEXT_PUBLIC_API_BASE_URL);
      console.log("Token:", token);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ code }),
          credentials: "include",
        }
      );

      console.log("Response status:", response.status);

      const result = await response.json();
      console.log("Verify response full:", result);

      if (!response.ok) {
        throw new Error(
          result.detail || result.message || `خطای سرور: ${response.status}`
        );
      }

      const newToken = result.token || result.access_token;
      if (newToken) Cookies.set("access_token", newToken, { expires: 7 });

      if (result.email) Cookies.set("user_email", result.email, { expires: 7 });
      if (result.name) Cookies.set("user_name", result.name, { expires: 7 });

      router.push("/chat");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Verify error:", err);
        setErrorMessage(err.message);
      } else {
        console.error("Verify error:", err);
        setErrorMessage("خطای ناشناخته در اعتبارسنجی کد");
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-sm border-none">
        <CardHeader>
          <div className="flex flex-col items-center justify-center">
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
              کد ۶ رقمی ارسال شده به ایمیل {email ?? "m@example.com"} را وارد
              کنید
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col justify-center items-center">
          <InputOTP
            maxLength={6}
            value={code}
            onChange={(val) => setCode(val)}
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

        <CardFooter className="flex-col gap-1">
          <Button
            onClick={onSubmit}
            className="w-[340px] h-10 text-base font-medium"
          >
            اعتبارسنجی
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CheckEmail;
