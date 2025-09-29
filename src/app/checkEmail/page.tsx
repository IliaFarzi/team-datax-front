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
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Loader2 } from "lucide-react";
import Logo from "../../../public/svg/Logo";

const CheckEmail = () => {
  const [code, setCode] = useState("");
  const [email, setEmail] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendTimer, setResendTimer] = useState(120); // 2 minutes timer
  const [canResend, setCanResend] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const savedEmail = Cookies.get("signup_email");
    if (savedEmail) {
      setEmail(savedEmail);
    } else {
      toast({
        variant: "destructive",
        description: "ایمیل یافت نشد، دوباره ثبت‌نام کنید",
        duration: 3000,
      });
    }
    console.log("Saved email:", savedEmail);
  }, [toast]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleResendCode = async () => {
    if (!canResend) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/resend-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("access_token")}`,
          },
          body: JSON.stringify({ email }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("خطا در ارسال مجدد کد");
      }

      toast({
        variant: "success",
        description: "کد جدید به ایمیل شما ارسال شد",
        duration: 3000,
      });
      setResendTimer(120);
      setCanResend(false);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "خطای ناشناخته در ارسال کد";
      toast({
        variant: "destructive",
        description: errorMsg,
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async () => {
    setIsSubmitting(true);
    try {
      const token = Cookies.get("access_token");
      if (!token || token === "undefined") {
        throw new Error("توکن معتبر یافت نشد، دوباره ثبت‌نام کنید");
      }

      if (code.length !== 6) {
        throw new Error("کد ۶ رقمی را وارد کنید");
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

      toast({
        variant: "success",
        description: result.message || "ثبت نام با موفقیت انجام شد",
        duration: 3000,
      });

      router.push("/chat");
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "خطای ناشناخته در اعتبارسنجی کد";
      toast({
        variant: "destructive",
        title: "خطا",
        description: errorMsg,
        duration: 3000,
      });
      console.error("Verify error:", errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-none md:max-w-md border-none">
        <CardHeader>
          <div className="flex flex-col items-center justify-center">
            <Logo height={36} width={36} />
            <CardTitle className="font-semibold text-[20px]">
              اعتبارسنجی ایمیل
            </CardTitle>
          </div>
          <p className="text-[14px] text-center w-full md:w-[390px] mb-5">
            کد ۶ رقمی ارسال شده به ایمیل{" "}
            <span dir="ltr" className="inline-block">
              {email ?? "m@example.com"}
            </span>{" "}
            را وارد کنید
          </p>
        </CardHeader>

        <CardContent className="flex flex-col justify-center items-center">
          <InputOTP
            maxLength={6}
            value={code}
            onChange={(val) => setCode(val)}
            className="mx-auto"
            dir="ltr"
          >
            <InputOTPGroup>
              <InputOTPSlot index={5} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={0} />
            </InputOTPGroup>
          </InputOTP>

          <div className="flex gap-6 mt-3 text-[14px]">
            <h3
              className={`cursor-pointer text-[#1668E3] underline underline-offset-4 ${
                !canResend ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleResendCode}
            >
              ارسال مجدد کد {canResend ? "" : `(${formatTime(resendTimer)})`}
            </h3>
            <Link href={"/signup"}>
              <h3 className="cursor-pointer text-[#1668E3] underline underline-offset-4">
                ویرایش ایمیل
              </h3>
            </Link>
          </div>
        </CardContent>

        <CardFooter className="flex-col gap-1 mt-4 sm:mx-12">
          <Button
            onClick={onSubmit}
            className="w-full md:w-[390px] h-10 text-base font-medium rounded-md"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin text-white" />
            ) : (
              "اعتبارسنجی"
            )}
          </Button>
        </CardFooter>
        <Toaster />
      </Card>
    </div>
  );
};

export default CheckEmail;
