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
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  number: string;
  confirmPassword: string;
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterRequest>();

  const onSubmit = async (data: RegisterRequest) => {
    try {
      console.log("API Base URL:", process.env.NEXT_PUBLIC_API_BASE_URL);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            full_name: data.name,
            email: data.email,
            phone: data.number,
            password: data.password,
          }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        let errorDetail = "ثبت‌نام ناموفق بود";
        try {
          const result: ApiErrorResponse = await response.json();
          errorDetail =
            typeof result.detail === "string"
              ? result.detail
              : Array.isArray(result.detail)
              ? result.detail
                  .map((err) => err.msg ?? err.message ?? "")
                  .join(", ")
              : errorDetail;
        } catch (jsonError) {
          console.error("JSON parse error:", jsonError);
        }
        throw new Error(errorDetail);
      }

      const result = await response.json();
      console.log("Signup response full:", result);

      if (result.user_id) {
        Cookies.set("user_id", result.user_id, {
          expires: 1,
          secure: false,
          sameSite: "Lax",
          path: "/",
        });
      } else {
        throw new Error("شناسه کاربر در پاسخ سرور یافت نشد");
      }

      if (result.token) {
        Cookies.set("access_token", result.token, {
          expires: 1,
          secure: false,
          sameSite: "Lax",
          path: "/",
        });
      } else {
        throw new Error("توکن در پاسخ سرور یافت نشد");
      }

      Cookies.set("signup_email", data.email, {
        expires: 1,
        secure: false,
        sameSite: "Lax",
        path: "/",
      });

      if (result.name) {
        Cookies.set("user_name", result.name, {
          expires: 100,
          secure: false,
          sameSite: "Lax",
          path: "/",
        });
      }

      console.log("Redirecting to /checkEmail");
      router.push("/checkEmail");
    } catch (error: unknown) {
      const errorMsg =
        error instanceof Error ? error.message : "ثبت‌نام ناموفق بود";
      toast({
        variant: "destructive",
        title: "خطا",
        description: errorMsg,
      });
      console.error("Signup error:", errorMsg);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-sm shadow-none">
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
              ثبت نام در دیتاکس
            </CardTitle>
            <div className="flex gap-1 text-[14px]">
              <span>از قبل حساب دارید؟</span>
              <div className="text-[#1668E3] underline underline-offset-4">
                <Link href={"/login"}>وارد شوید</Link>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6 items-center justify-center">
              <div className="grid  gap-2">
                <Label htmlFor="name" className="text-[14px]">
                  نام و نام خانوادگی <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="مثلا مانی جلیلی"
                  className="w-[327px] md:w-[390px] "
                  {...register("name", {
                    required: "نام و نام خانوادگی الزامی است",
                  })}
                />
                {errors.name && (
                  <span className="text-red-500 text-sm">
                    {errors.name.message}
                  </span>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">
                  ایمیل <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@domain.com"
                  className="w-[327px] md:w-[390px]"
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

              <div className="grid gap-2">
                <Label htmlFor="number">
                  شماره همراه <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="number"
                  type="tel"
                  placeholder="مثلا ۰۹۱۲۳۴۵۶۷۸۹"
                  className="w-[327px] md:w-[390px] "
                  {...register("number", {
                    required: "شماره همراه الزامی است",
                    pattern: {
                      value: /^(?:\+98|0)?9\d{9}$/,
                      message: "شماره همراه نامعتبر است",
                    },
                  })}
                />
                {errors.number && (
                  <span className="text-red-500 text-sm">
                    {errors.number.message}
                  </span>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">
                  رمز عبور <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    className="w-[327px] md:w-[390px] "
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
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 left-2 flex items-center text-gray-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-red-500 text-sm">
                    {errors.password.message}
                  </span>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">
                  تکرار رمز عبور <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    className="w-[327px] md:w-[390px] "
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    {...register("confirmPassword", {
                      required: "تکرار رمز عبور الزامی است",
                      validate: (value) =>
                        value === watch("password") ||
                        "رمز عبور و تکرار آن یکسان نیستند",
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute inset-y-0 left-2 flex items-center text-gray-500"
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="text-red-500 text-sm">
                    {errors.confirmPassword.message}
                  </span>
                )}
              </div>
            </div>

            <CardFooter className="flex-col gap-2 mt-4">
              <Button
                type="submit"
                className="w-[327px] md:w-[390px] mt-6 h-10 text-base font-medium rounded-md"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin text-white" />
                ) : (
                  "ثبت‌نام"
                )}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
        <span className="text-[11px] text-center text-[#71717A] font-medium mt-3">
          ثبت نام شما در دیتاکس به معنی پذیرش تمامی{" "}
          <span className="text-[#1668E3] underline underline-offset-4">
            قوانین و مقررات
          </span>{" "}
          آن می‌باشد.
        </span>
        <Toaster />
      </Card>
    </div>
  );
}

export default CardDemo;
