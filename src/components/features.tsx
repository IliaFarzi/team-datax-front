import { Unplug, Share2 } from "lucide-react";
import React from "react";
import Clock from "../../public/svg/clock";
import UserA from "../../public/svg/userA";
import Chart from "../../public/svg/chart";
import Dashboard from "../../public/svg/Dashboard";

const features = [
  {
    icon: Clock,
    title: "تحلیل در چند ثانیه",
    description:
      "سؤال خود را بپرسید و فوری گزارش بگیرید؛ بدون نیاز به منتظر تیم BI ماندن.",
  },
  {
    icon: Unplug,
    title: "یکپارچه با منابع شما",
    description:
      "از دیتابیس تا Google Workspace و فایل‌های داخلی؛ همه به دیتاکس وصل می‌شوند.",
  },
  {
    icon: UserA,
    title: "بدون نیاز به تخصص داده",
    description:
      "بدون دانش فنی و نیروی BI هم می‌توانید تحلیل‌های حرفه‌ای انجام دهید.",
  },
  {
    icon: Chart,
    title: "گزارش‌های بصری",
    description:
      "نمودارها و جداول شفاف تحویل بگیرید که داده‌ها را قابل فهم می‌کنند.",
  },
  {
    icon: Dashboard,
    title: "بدون داشبوردهای پیچیده",
    description:
      "دیگر نیازی به داشبوردهای پیچیده نیست؛ دیتاکس همه‌چیز را ساده می‌کند.",
  },
  {
    icon: Share2,
    title: "خروجی و اشتراک‌گذاری آسان",
    description:
      "گزارش‌ها را در قالب‌های مختلف ذخیره کنید و به‌سادگی با تیم به اشتراک بگذارید.",
  },
];

const Features = () => {
  return (
    <div id="features" className="w-full py-12 xs:py-20 px-6">
      <h2 className="text-3xl xs:text-4xl sm:text-5xl font-bold tracking-tight text-center">
        امکانات دیتاکس
      </h2>
      <div className="w-full max-w-screen-lg mx-auto mt-10 sm:mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="flex flex-col bg-background border rounded-xl py-6 px-5"
          >
            <div className="mb-3 h-10 w-10 flex items-center justify-center bg-muted rounded-full">
              <feature.icon className="h-6 w-6" />
            </div>
            <span className="text-lg font-semibold">{feature.title}</span>
            <p className="mt-1 text-foreground/80 text-[15px]">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
