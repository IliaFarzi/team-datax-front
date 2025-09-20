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
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Loader2 } from "lucide-react";

interface LoginRequest {
  email: string;
}

type ErrorDetailItem = {
  msg?: string;
  message?: string;
  [key: string]: unknown;
};

type ApiErrorResponse = {
  detail?: string | ErrorDetailItem[];
};

type ApiSuccessResponse = {
  message: string;
  email: string;
  user_id: string;
  reset_link: string;
};

function CardDemo() {
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
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/reset-password/request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: data.email,
          }),
        }
      );

      if (!response.ok) {
        let errorDetail = "درخواست ناموفق بود";
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

      const result: ApiSuccessResponse = await response.json();
      console.log("Forgot password response:", result);

      const url = new URL(result.reset_link);
      const resetToken = url.searchParams.get("token");
      if (resetToken) {
        Cookies.set("reset_token", resetToken, { expires: 1 });
        Cookies.set("user_id", result.user_id, { expires: 1 });
        Cookies.set("user_email", result.email, { expires: 2 });
      } else {
        throw new Error("توکن بازنشانی رمز در لینک یافت نشد");
      }

      router.push("/checkPassword");
    } catch (error: unknown) {
      const errorMsg =
        error instanceof Error ? error.message : "بازنشانی رمز ناموفق بود";
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
      <Card className="w-full max-w-none md:max-w-md border-none">
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
              فراموشی رمز عبور
            </CardTitle>
            <div className="flex gap-1 text-[14px]">
              <span className="">ایمیل خود را وارد کنید</span>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6 items-center justify-center">
              <div className="grid gap-2 relative w-full">
                <Label htmlFor="email">
                  ایمیل <span className="text-red-500">*</span>
                </Label>
                <Input
                  className="w-full md:w-[390px]"
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
            </div>

            <CardFooter className="flex-col gap-1 mt-4">
              <Button
                type="submit"
                className="w-full md:w-[390px] h-10 text-base font-medium rounded-md"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin text-white" />
                ) : (
                  "دریافت لینک تغییر رمز"
                )}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
        <Toaster />
      </Card>
    </div>
  );
}

export default CardDemo;
