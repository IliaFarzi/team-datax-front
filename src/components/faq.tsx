import Question from "../../public/svg/Question";
import Security from "../../public/svg/Security";
import Box from "../../public/svg/Box";
import Brain from "../../public/svg/Brain";
import FileChartColumn from "../../public/svg/file-chart-column";
import ClockF from "../../public/svg/ClockF";

const faq = [
  {
    icon: Question,
    question: "دیتاکس دقیقاً چه کاری انجام می‌دهد؟",
    answer:
      "دیتاکس با هوش مصنوعی شما را از داشبوردهای پیچیده بی‌نیاز می‌کند و به راحتی می‌توانید داده‌ها را تحلیل و گزارش‌های تصویری دریافت کنید.",
  },
  {
    icon: ClockF,
    question: "چطور دیتاکس به تصمیم‌گیری سریع کمک می‌کند؟",
    answer:
      "با ارائه تحلیل لحظه‌ای، نمودار و جدول، دیتاکس داده‌ها را به بینش عملی تبدیل می‌کند تا سریع‌تر تصمیم بگیرید.",
  },
  {
    icon: Security,
    question: "می‌توانم برای امنیت بیشتر دیتاکس را روی مدل لوکال اجرا کنم؟",
    answer:
      "بله، در پلن ویژه این امکان وجود دارد. برای جزئیات و راه‌اندازی، با تیم ما تماس بگیرید.",
  },
  {
    icon: Box,
    question: "آیا امکان تست رایگان یا دموی محصول وجود دارد؟",
    answer:
      "بله، می‌توانید قبل از خرید، نسخه آزمایشی یا دموی دیتاکس را امتحان کنید تا با امکانات و عملکرد آن آشنا شوید.",
  },
  {
    icon: Brain,
    question: "برای کار با دیتاکس نیاز به دانش تخصصی BI دارم؟",
    answer:
      "خیر، دیتاکس به صورتی طراحی شده تا بدون دانش فنی هم بتوانید به راحتی داده‌ها را تحلیل و گزارش بگیرید.",
  },
  {
    icon: FileChartColumn,
    question: "چطور می‌توانم از داده‌های خود گزارش بگیرم؟",
    answer:
      "پاسخ: کافی است سوال خود را به صورت چت وارد کنید؛ دیتاکس در لحظه گزارشی شامل جدول و نمودار آماده می‌کند.",
  },
];

const FAQ = () => {
  return (
    <div
      id="faq"
      className="min-h-screen flex items-center justify-center px-6 py-12 xs:py-20"
    >
      <div className="max-w-screen-lg">
        <h2 className="text-3xl xs:text-4xl md:text-5xl !leading-[1.15] font-bold tracking-tight text-center">
          سوالات پرتکرار
        </h2>
        <p className="mt-3 xs:text-lg text-center text-muted-foreground">
          به پرتکرار ترین سوالات شما پاسخ داده ایم.
        </p>

        <div className="mt-12 grid md:grid-cols-2 bg-background rounded-xl overflow-hidden  outline-[1px] outline-border outline-offset-[-1px]">
          {faq.map(({ question, answer, icon: Icon }) => (
            <div key={question} className="border p-6 -mt-px -ml-px">
              <div className="h-8 w-8 xs:h-10 xs:w-10 flex items-center justify-center rounded-full bg-accent">
                <Icon />
              </div>
              <div className="mt-3 mb-2 flex items-start gap-2 text-lg xs:text-[1.35rem] font-semibold tracking-tight">
                <span>{question}</span>
              </div>
              <p className="text-sm xs:text-base">{answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
