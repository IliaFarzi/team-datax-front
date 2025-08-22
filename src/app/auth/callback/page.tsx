"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Cookies from "js-cookie";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const sessionId = searchParams.get("session_id");
    const name = searchParams.get("name");
    const email = searchParams.get("email");

    if (token && sessionId && name && email) {
      Cookies.set("access_token", token, {
        expires: 7,
        secure: true,
        sameSite: "Strict",
      });
      Cookies.set("session_id", sessionId, {
        expires: 7,
        secure: true,
        sameSite: "Strict",
      });
      Cookies.set("user_name", name, {
        expires: 7,
        secure: true,
        sameSite: "Strict",
      });
      Cookies.set("user_email", email, {
        expires: 7,
        secure: true,
        sameSite: "Strict",
      });
      router.replace("/");
    } else {
      console.error("Missing query params:", { token, sessionId, name, email });
      router.replace("/login");
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>در حال تکمیل ورود... اگر صفحه متوقف ماند، لطفاً چند لحظه صبر کنید.</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CallbackHandler />
    </Suspense>
  );
}
