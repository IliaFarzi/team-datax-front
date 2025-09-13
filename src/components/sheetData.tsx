import Image from "next/image";
import React from "react";

export default function SheetData() {
  return (
    <div className="flex flex-col justify-center items-center text-center mx-8.5 gap-3">
      <h3 className="text-[#13072E] text-[30px] font-bold ">
        یکپارچه‌سازی ساده با منابع دانش شما
      </h3>
      <p className="text-[#585858]">
        همه داده های آنلاین و آفلاین خود را به دیتاکس برای تحلیل متصل کنید.
      </p>
      <Image
        height={60}
        width={60}
        src={"/public/images/googleSheet.png"}
        className="mt-10"
        alt="گوگل شیت"
      />
    </div>
  );
}
