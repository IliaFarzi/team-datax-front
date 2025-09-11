import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpLeft, CirclePlay } from "lucide-react";
import React from "react";

const Hero = () => {
  return (
    <div className="min-h-[calc(100vh-15rem)] flex flex-col items-center pt-20 px-6">
      <div className="md:mt-6 flex items-center justify-center">
        <div className="text-center max-w-2xl">
          <Badge className="bg-primary rounded-full py-1 border-none">
            نسخه ۱.۰.۰ هم‌اکنون در دسترس است
          </Badge>
          <h1 className="mt-6 max-w-[20ch] text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold !leading-[1.2] tracking-tight">
            نسل جدید هوش تجاری (BI) با قدرت هوش مصنوعی دیتاکس
          </h1>
          <p className="mt-6 max-w-[60ch] xs:text-lg">
            دیتاکس با قدرت هوش مصنوعی ، داده‌های پیچیده شما را به پاسخ‌های روشن
            و گزارش‌های دقیق تبدیل می‌کند. کافیست سؤال بپرسید و در لحظه، گزارشی
            شامل جدول و نمودار تحویل بگیرید؛ بدون نیاز به داشتن تخصص یا استفاده
            از داشبوردهای پیچیده.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-center sm:justify-center gap-4">
            <Button
              size="lg"
              className="w-full sm:w-auto rounded-full text-base"
            >
              رایگان امتحان کنید <ArrowUpLeft className="!h-5 !w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto rounded-full text-base shadow-none"
            >
              <CirclePlay className="!h-5 !w-5" /> مشاهده دمو
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
