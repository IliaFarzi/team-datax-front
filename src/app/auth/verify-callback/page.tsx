"use client";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function VerifyCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const status = searchParams.get("status");
  const email = searchParams.get("email");

  useEffect(() => {
    // اگر موفقیت بوده، کاربر رو مستقیم یا بعد از 1s به صفحه اصلی بفرست
    if (status === "success") {
      // کوتاه صبر می‌کنیم تا کاربر پیام موفقیت رو ببینه، بعد replace می‌کنیم
      const t = setTimeout(() => {
        router.replace("/"); // replace بهتره تا تاریخچه رو شلوغ نکنه
      }, 800);

      return () => clearTimeout(t);
    }
  }, [status, router]);

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 p-6 rounded-lg shadow">
        {status === "success" ? (
          <>
            <h1 className="text-2xl font-bold text-green-600">
              حساب تایید شد 🎉
            </h1>
            <p className="mt-2">ایمیل: {email}</p>
            <p className="mt-3 text-sm text-muted-foreground">
              در حال انتقال به صفحه اصلی...
            </p>
            <div className="mt-4">
              <Link href="/">
                <button className="px-4 py-2 rounded bg-sky-600 text-white">
                  رفتن به صفحه اصلی اکنون
                </button>
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-red-600">
              خطا در تایید حساب
            </h1>
            <p className="mt-2">لطفاً دوباره تلاش کنید </p>
            <div className="mt-4 flex gap-2">
              <Link href="/auth">
                <button className="px-4 py-2 rounded border">برگشت</button>
              </Link>
              <Link href="/signup">
                <button className="px-4 py-2 rounded bg-sky-600 text-white">
                  ویرایش ایمیل
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
