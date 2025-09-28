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
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import Logo from "../../../public/svg/Logo";

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordRequest>();

  const onSubmit = async (data: ResetPasswordRequest) => {
    try {
      const resetToken = Cookies.get("access_token");
      if (!resetToken) {
        throw new Error("توکن بازنشانی رمز یافت نشد");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/reset-password/confirm`,
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
      <Card className="w-full max-w-none md:max-w-md shadow-none">
        <CardHeader>
          <div className="flex flex-col items-center justify-center">
            <Logo height={36} width={36} />
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
            <div className="flex flex-col gap-6 items-center justify-center">
              <div className="grid gap-2 relative w-full">
                <Label htmlFor="password">
                  رمز عبور <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    className="w-full md:w-[390px]"
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

              <div className="grid gap-1 relative w-full">
                <Label htmlFor="confirmPassword">
                  تکرار رمز عبور <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    className="w-full md:w-[390px]"
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
                className="w-full md:w-[390px] h-10 text-base font-medium rounded-md"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin text-white" />
                ) : (
                  "تغییر رمز عبور"
                )}
              </Button>
            </CardFooter>
          </form>
          <Toaster />
        </CardContent>
      </Card>
    </div>
  );
}

export default CardDemo;
