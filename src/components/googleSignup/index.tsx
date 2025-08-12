"use client";

import { Button } from "@/components/ui/button";

export default function SignupButton() {
  const handleGoogleSignup = () => {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
    window.location.href = `${apiBase}/auth/signup`;
  };

  return (
    <Button variant="outline" className="w-full" onClick={handleGoogleSignup}>
      ثبت‌نام با گوگل
    </Button>
  );
}
