import { Button } from "@/components/ui/button";
import Link from "next/link";
import Telegram from "../../public/svg/Telegram";
import Google from "../../public/svg/Google";
import Linkdin from "../../public/svg/Linkdin";
import Instagram from "../../public/svg/Instagram";

const footerLinks = [
  {
    title: "امکانات",
    href: "#features",
  },
  {
    title: "قیمت گذاری",
    href: "#pricing",
  },
  {
    title: "سوالات پرتکرار",
    href: "#faq",
  },
  {
    title: "نظرات مشتریان",
    href: "#testimonials",
  },
  {
    title: "قوانین و مقررات",
    href: "#privacy",
  },
];

const Footer = () => {
  return (
    <footer className=" mt-40 dark bg-black text-foreground">
      <div className=" mx-10 ">
        <div className="py-12 flex flex-col sm:flex-row items-start justify-between gap-x-8 gap-y-10 px-6 xl:px-0">
          <div className="">
            {/* Logo */}
            <div className="flex gap-2">
              <svg
                width="26"
                height="26"
                viewBox="0 0 26 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M14.3823 0C18.8374 0.61283 22.1959 2.85189 24.4579 6.71702C26.5902 11.0485 26.5112 15.3421 24.2208 19.5979C21.867 23.3376 18.4822 25.445 14.0662 25.9198C12.275 25.9198 10.4839 25.9198 8.69262 25.9198C8.69262 23.075 8.69262 20.2301 8.69262 17.3852C11.5773 17.4115 14.4485 17.3851 17.3062 17.3062C17.3062 14.4086 17.3062 11.5112 17.3062 8.6136C14.4086 8.6136 11.5112 8.6136 8.61359 8.6136C8.53473 11.4713 8.50833 14.3425 8.53457 17.2272C5.68971 17.2272 2.84486 17.2272 0 17.2272C0 11.4848 0 5.74242 0 0C4.79414 0 9.58819 0 14.3823 0Z"
                  fill="white"
                />
              </svg>
              <h4 className="text-white">دیتاکس</h4>
            </div>
            <ul className="mt-6 flex items-center gap-4 flex-wrap">
              {footerLinks.map(({ title, href }) => (
                <li key={title}>
                  <Link
                    href={href}
                    className="text-muted-foreground hover:text-white"
                  >
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5">
            <Button
              className="bg-white text-black cursor-pointer"
              variant={"ghost"}
            >
              تماس با پشتیبانی و فروش
            </Button>
          </div>
        </div>
        <div className="py-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-x-2 gap-y-5 px-6 xl:px-0">
          {/* Copyright */}
          <span className=" text-white text-center sm:text-start">
            کلیه حقوق مادی و معنوی این وب‌سایت متعلق به تیم دیتاکس می‌باشد 
          </span>

          <div className="flex items-center  gap-8 text-muted-foreground">
            <Link href="#" target="_blank">
              <Telegram />
            </Link>
            <Link href="#" target="_blank">
              <Google />
            </Link>
            <Link href="#" target="_blank">
              <Linkdin />
            </Link>
            <Link href="#" target="_blank">
              <Instagram />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
