"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const sessionId = searchParams.get("session_id");
    const name = searchParams.get("name");
    const email = searchParams.get("email");

    if (token && sessionId && name && email) {
      localStorage.setItem("access_token", token);
      localStorage.setItem("session_id", sessionId);
      localStorage.setItem("user_name", name);
      localStorage.setItem("user_email", email);
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
