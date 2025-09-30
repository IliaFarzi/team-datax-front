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
import Logo from "../../../public/svg/Logo";

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
  token: string;
  reset_code?: string;
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

      if (result.token) {
        Cookies.set("access_token", result.token, { expires: 1 });
        Cookies.set("user_id", result.user_id, { expires: 1 });
        Cookies.set("user_email", result.email, { expires: 2 });
      } else {
        throw new Error("توکن بازنشانی رمز یافت نشد");
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
            <Logo height={36} width={36} />
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
                    required: "لطفاً ایمیل را وارد کنید.",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "فرمت ایمیل معتبر نیست.",
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
