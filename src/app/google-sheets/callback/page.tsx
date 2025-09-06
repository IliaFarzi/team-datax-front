// app/google-sheets/callback/page.tsx
import { Suspense } from "react";
import CallbackContent from "./CallbackContent";

export default function Callback() {
  return (
    <div className="min-h-screen bg-white">
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">در حال بارگذاری...</div>
          </div>
        }
      >
        <CallbackContent />
      </Suspense>
    </div>
  );
}
