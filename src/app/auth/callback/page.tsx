"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("access_token");
    const sessionId = params.get("session_id");
    if (accessToken) {
      localStorage.setItem("access_token", accessToken);
    }
    if (sessionId) {
      localStorage.setItem("session_id", sessionId);
    }

    router.replace("/chat");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div>
        <p>
          در حال تکمیل ورود... اگر صفحه متوقف ماند، لطفاً چند لحظه صبر کنید.
        </p>
      </div>
    </div>
  );
}
