"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { CircleCheck } from "lucide-react";
import { useState } from "react";

const plans = [
  {
    name: "شروع‌کننده",
    price: "۱‍.۸۰۰.۰۰۰ تومان ",
    year: "۱۷.۲۸۰.۰۰۰تومان ",
    isPopular: true,
    description: "مناسب برای کسب‌وکارهای کوچک و شروع‌کننده",
    features: [{ title: "تا ۲۵۰ پیام" }, { title: "۷ روز ذخیره سازی فایل‌ها" }],
    buttonText: "ثبت نام",
  },
  {
    name: "حرفه‌ای",
    price: "۴.۲۰۰.۰۰۰ تومان ",
    year: "۴۰.۳۲۰.۰۰۰تومان ",
    isRecommended: false,
    description: "مناسب برای کسب‌وکارهای در حال رشد و متوسط",
    features: [
      { title: "تا ۱۰۰۰ پیام" },
      { title: "۱۰ روز ذخیره سازی فایل‌ها" },
    ],

    buttonText: "ثبت نام",
  },
  {
    name: "ویژه",
    price: "سفارشی ",
    year: "سفارشی  ",

    isRecommended: false,
    description: "راه‌حل سفارشی برای سازمان‌های بزرگ",
    features: [
      { title: "بدون محدودیت پیام" },
      { title: "بدون محدودیت در نگه داری فایل‌ها" },
    ],

    buttonText: "تماس با فروش",
  },
];

const Pricing = () => {
  const [selectedBillingPeriod, setSelectedBillingPeriod] = useState("monthly");

  return (
    <div
      id="pricing"
      className="flex flex-col items-center justify-center py-12 xs:py-20 px-6"
    >
      <h1 className="text-3xl xs:text-4xl md:text-5xl font-bold text-center tracking-tight">
        قیمت گذاری
      </h1>
      <Tabs
        value={selectedBillingPeriod}
        onValueChange={setSelectedBillingPeriod}
        className="mt-8"
      >
        <TabsList className="h-11 " dir="rtl">
          <TabsTrigger
            value="monthly"
            className="py-1.5 text-[18px] cursor-pointer font-bold"
          >
            ماهانه
          </TabsTrigger>
          <span className="text-[18px]">-</span>
          <TabsTrigger
            value="yearly"
            className="py-1.5 text-[18px] cursor-pointer font-bold"
          >
            سالانه
          </TabsTrigger>
          <span dir="rtl" className="text-[#585858] text-[18px] font-black">
            ( ۲۰ درصد تخفیف)
          </span>
        </TabsList>
      </Tabs>
      <div className="mt-12 max-w-screen-lg mx-auto grid grid-cols-1 lg:grid-cols-3 items-center gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "relative rounded-xl p-6 bg-background/50",
              plan.isPopular
                ? "border-2 border-black py-10 "
                : "border border-gray-200"
            )}
          >
            {plan.isPopular && (
              <Badge className="absolute  top-0 right-1/2 translate-x-1/2 -translate-y-1/2">
                محبوب ترین
              </Badge>
            )}
            <h3 className="text-lg font-medium">{plan.name}</h3>
            <p className="mt-2 text-[25px] text-[#1668E3] font-bold">
              {selectedBillingPeriod === "monthly" ? plan.price : plan.year}
              <span className="ml-1.5 text-sm text-muted-foreground font-normal">
                {selectedBillingPeriod === "monthly" ? "/ماهانه" : "/سالانه"}
              </span>
            </p>
            <p className="mt-4 font-medium text-muted-foreground">
              {plan.description}
            </p>

            <Button
              variant={plan.isPopular ? "default" : "outline"}
              size="lg"
              className="w-full mt-6 text-base"
            >
              {plan.buttonText}
            </Button>
            <Separator className="my-8" />
            <ul className="space-y-2">
              {plan.features.map((feature) => (
                <li key={feature.title} className="flex items-start gap-1.5">
                  <CircleCheck className="h-4 w-4 mt-1 text-green-600" />
                  {feature.title}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
