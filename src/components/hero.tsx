import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpLeft, CirclePlay } from "lucide-react";
import Link from "next/link";
import React from "react";

const Hero = () => {
  return (
    <div className="min-h-[calc(100vh-30rem)] flex flex-col items-center pt-20 px-6">
      <div className="md:mt-6 flex items-center justify-center">
        <div className="text-center max-w-2xl flex flex-col justify-center items-center">
          <Badge className="bg-[#E3EEFF] text-[#1668E3] rounded-full py-1 border-none">
            نسخه ۱.۰.۰ هم‌اکنون در دسترس است
          </Badge>
          <h1 className="mt-6 md:w-200 text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold !leading-[1.2] tracking-tight">
            نسل جدید هوش تجاری (BI) با قدرت هوش مصنوعی دیتاکس
          </h1>
          <p className="mt-6 text-[18px] text-black xs:text-lg">
            دیتاکس با قدرت هوش مصنوعی ، داده‌های پیچیده شما را به پاسخ‌های روشن
            و گزارش‌های دقیق تبدیل می‌کند. کافیست سؤال بپرسید و در لحظه، گزارشی
            شامل جدول و نمودار تحویل بگیرید؛ بدون نیاز به داشتن تخصص یا استفاده
            از داشبوردهای پیچیده.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-center sm:justify-center gap-4">
            <Link href={"/signup"}>
              <Button
                size="lg"
                className="w-full sm:w-auto rounded-full text-base"
              >
                ثبت نام در لیست انتظار <ArrowUpLeft className="!h-5 !w-5" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto rounded-full text-base shadow-none"
            >
              <CirclePlay color="#A1A1AA" className="!h-5 !w-5" /> مشاهده دمو
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
