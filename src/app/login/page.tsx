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
import Logo from "../../../public/svg/Logo";

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
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginRequest>();

  const onSubmit = async (data: LoginRequest) => {
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
        path: "/",
      });

      if (result.token) {
        Cookies.set("access_token", result.token, {
          expires: 7,
          secure: false,
          sameSite: "Lax",
          path: "/",
        });
      } else {
        throw new Error("توکن در پاسخ سرور یافت نشد");
      }

      if (result.session_id) {
        Cookies.set("session_id", result.session_id, {
          expires: 7,
          secure: false,
          sameSite: "Lax",
          path: "/",
        });
      }

      if (result.user?.email || result.email) {
        Cookies.set("user_email", result.user?.email || result.email, {
          expires: 7,
          secure: false,
          sameSite: "Lax",
          path: "/",
        });
      }

      router.push("/chat");
    } catch (error: unknown) {
      const errorMsg =
        error instanceof Error ? error.message : "ورود ناموفق بود";
      toast({
        variant: "destructive",
        title: "خطا",
        description: errorMsg,
      });
      console.error("Login error:", errorMsg);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-none md:max-w-md border-none">
        <CardHeader>
          <div className="flex flex-col items-center justify-center">
            <Logo height={36} width={36} />
            <CardTitle className="font-semibold text-[20px] ">
              ورود به دیتاکس
            </CardTitle>
            <div className="flex gap-1 text-[14px]">
              <span>حساب کاربری ندارید؟</span>
              <span className="text-[#1668E3] underline underline-offset-2">
                <Link href={"/signup"}>ثبت‌نام کنید</Link>
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="md:m-0 ">
            <div className="flex flex-col gap-6 items-center justify-center">
              <div className="grid gap-2 relative w-full ">
                <Label htmlFor="email">
                  ایمیل <span className="text-red-500">*</span>
                </Label>
                <Input
                  className="w-full  md:w-[390px]"
                  id="email"
                  type="email"
                  placeholder="example@domain.com"
                  {...register("email", {
                    required: "ایمیل الزامی است",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
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

              <div className="grid gap-1 relative w-full ">
                <div className="flex justify-between">
                  <Label htmlFor="password">
                    رمز عبور <span className="text-red-500">*</span>
                  </Label>
                  <Link href={"/forgetPassword"}>
                    <span className="text-[12px] md:text-[14px] ml-4 text-[#1668E3] underline underline-offset-2">
                      رمز عبورتان را فراموش کردید؟
                    </span>
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    className="w-full  md:w-[390px]"
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
                    className="absolute inset-y-0 left-2 md:left-5 flex items-center text-gray-500"
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
                className="w-full  md:w-[390px] h-10 text-base font-medium rounded-md"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin text-white" />
                ) : (
                  "ورود"
                )}
              </Button>
            </CardFooter>
          </form>
        </CardContent>

        <span className="text-[11.5px] text-center text-[#71717A] font-medium block ">
          ثبت نام شما در دیتاکس به معنی پذیرش تمامی{" "}
          <span className="text-[#1668E3] underline underline-offset-2">
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
