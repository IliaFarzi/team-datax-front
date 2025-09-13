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
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface ResetPasswordRequest {
  password: string;
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordRequest>();

  const onSubmit = async (data: ResetPasswordRequest) => {
    setErrorMessage(null);

    try {
      const resetToken = Cookies.get("reset_token");
      if (!resetToken) {
        throw new Error("توکن بازنشانی رمز یافت نشد");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resetToken}`,
          },
          body: JSON.stringify({
            new_password: data.password,
          }),
        }
      );

      if (!response.ok) {
        let errorDetail = "بازنشانی رمز ناموفق بود";
        if (response.status === 401) {
          errorDetail = "توکن نامعتبر است یا منقضی شده است";
        } else {
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
        }
        throw new Error(errorDetail);
      }

      const result = await response.json();
      console.log("Reset password response:", result);

      router.push("/");
    } catch (error: unknown) {
      const errorMsg =
        error instanceof Error ? error.message : "بازنشانی رمز ناموفق بود";
      setErrorMessage(errorMsg);
      console.error("Reset password error:", errorMsg);
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
              تغییر رمز عبور
            </CardTitle>
            <div className="flex gap-1 text-[14px]">
              <span>رمز عبور جدید خود را وارد کنید</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              {/* password */}
              <div className="grid gap-2">
                <Label htmlFor="password">
                  رمز عبور <span className="text-red-500">*</span>
                </Label>
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

              {/* confirm password */}
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">
                  تکرار رمز عبور <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
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
                className="w-[340px] mt-6 h-10 text-base font-medium rounded-md"
                disabled={isSubmitting}
              >
                {isSubmitting ? "در حال پردازش..." : "تغییر رمز عبور"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>

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
