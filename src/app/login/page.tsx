"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface LoginRequest {
  email: string;
  password: string;
}

type ErrorDetailItem = {
  msg?: string;
  message?: string;
  [key: string]: unknown;
};

type ApiErrorResponse = {
  detail?: string | ErrorDetailItem[];
};

function CardDemo() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginRequest>();

  const onSubmit = async (data: LoginRequest) => {
    setErrorMessage(null);

    try {
      console.log("API Base URL:", process.env.NEXT_PUBLIC_API_BASE_URL);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        let errorDetail = "ورود ناموفق بود";
        try {
          const result: ApiErrorResponse = await response.json();
          errorDetail =
            typeof result.detail === "string"
              ? result.detail
              : Array.isArray(result.detail)
              ? result.detail
                  .map((err) => err.msg ?? err.message ?? "")
                  .filter(Boolean)
                  .join(", ")
              : errorDetail;
        } catch (jsonError) {
          console.error("JSON parse error:", jsonError);
        }
        throw new Error(errorDetail);
      }

      const result = await response.json();
      console.log("Login response full:", result);

      const userId = result.user?.id || result.user_id;
      if (!userId) {
        throw new Error("شناسه کاربر در پاسخ سرور یافت نشد");
      }

      Cookies.set("user_id", userId, {
        expires: 7,
        secure: false,
        sameSite: "Lax",
      });

      if (result.token) {
        Cookies.set("access_token", result.token, {
          expires: 7,
          secure: false,
          sameSite: "Lax",
        });
      } else {
        throw new Error("توکن در پاسخ سرور یافت نشد");
      }

      if (result.session_id) {
        Cookies.set("session_id", result.session_id, {
          expires: 7,
          secure: false,
          sameSite: "Lax",
        });
      }

      if (result.user?.email || result.email) {
        Cookies.set("user_email", result.user?.email || result.email, {
          expires: 7,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Strict",
        });
      }

      console.log("Redirecting to /");
      router.push("/chat");
    } catch (error: unknown) {
      const errorMsg =
        error instanceof Error ? error.message : "ورود ناموفق بود";
      setErrorMessage(errorMsg);
      console.error("Login error:", errorMsg);
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
              ورود به دیتاکس
            </CardTitle>
            <div className="flex gap-1 text-[14px]">
              <span>حساب کاربری ندارید؟</span>
              <Link href={"/signup"}>ثبت‌نام کنید</Link>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              {/* ایمیل */}
              <div className="grid gap-2 relative">
                <Label htmlFor="email">
                  ایمیل <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@domain.com"
                  {...register("email", {
                    required: "ایمیل الزامی است",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA.Z]{2,}$/,
                      message: "ایمیل نامعتبر است",
                    },
                  })}
                />
                {errors.email && (
                  <span className="text-red-500 text-sm">
                    {errors.email.message}
                  </span>
                )}
              </div>

              {/* رمز عبور */}
              <div className="grid gap-1 relative">
                <div className="flex justify-between">
                  <Label htmlFor="password">
                    رمز عبور <span className="text-red-500">*</span>
                  </Label>
                  <Link href={"/forgetPassword"}>
                    <span className="text-[14px] text-[#09090B]">
                      رمز عبورتان را فراموش کردید؟
                    </span>
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password", {
                      required: "رمز عبور الزامی است",
                      minLength: {
                        value: 6,
                        message: "رمز عبور باید حداقل ۶ کاراکتر باشد",
                      },
                    })}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 left-2 flex items-center text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-red-500 text-sm">
                    {errors.password.message}
                  </span>
                )}
              </div>
            </div>

            <CardFooter className="flex-col gap-1 mt-4">
              <Button
                type="submit"
                className="w-[340px] h-10 text-base font-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? "در حال ورود..." : "ورود"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>

        <span className="text-[11.5px] text-center text-[#71717A] font-medium mt-16">
          ورود شما به دیتاکس به معنی پذیرش تمامی قوانین و مقررات آن می‌باشد.
        </span>

        {errorMessage && (
          <div className="text-red-500 text-sm mt-4 text-center">
            {errorMessage}
          </div>
        )}
      </Card>
    </div>
  );
}
export default CardDemo;
