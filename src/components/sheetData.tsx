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
        src={
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAhCAYAAACvBDmYAAAAAXNSR0IArs4c6QAAAYxJREFUWEdjZMABTJYHFv5nYGxnZGRkx6WG+uL/DvxnZGw6G75uP7rZjNgsM1kRuJ+BgcmB+g4hzsT/jP+d0B2L4VCVSZ7sAmJcP4gzkjaq/v3/f/Bc5DqUgMJwqPHywBJGRqZuYpxgLKbNYCSqDVd67vVVhrOvrhKjlaCaMxFrUdyG4VCT5UENDIyM9QRNYmBgSNUOY0jTCYMrnXVlFcPsq6uI0UpQzahDQUE0GqIMDAyjaZRgbiGgYPhmplgNf4Y8/VhKA4igfvSMSHKIjjoULYwpDlFbKRMGD3lbrFGnzC/LoMwvB5e7+/ERw92PjwlGMzYF+56cYNj7+DhciuSox2fraBXKwMAwGqKjdT00k4zW9WSVUUiaRjPTaGYazUyjvVC0cmRY9uv1RNQZ9EU04F69+OYGw6U3NyktQsH6CZajBksDDFiYmc9TxTZyDfnP8O1M5FpuZO3YR/OWBx1jYGS0JNceSvX9Z2AoPhuxto8Ih4Y4/Gf4387IyGBBqaWk6/934EzEekd0fQBul0Ax/Nn2agAAAABJRU5ErkJggg=="
        }
        className="mt-10"
        alt="گوگل شیت"
      />
    </div>
  );
}
