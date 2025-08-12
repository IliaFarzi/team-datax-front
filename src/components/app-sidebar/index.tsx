import {
  FilePenIcon,
  LogOut,
  MessageSquare,
  Settings,
  Unplug,
  Trash,
} from "lucide-react";
import Image from "next/image";

import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

export function AppSidebar() {
  const chatSubjects = ["شروع مکالمه", "سلام وقت بخیر", "تحلیل دیتای مالی"];
  return (
    <Sidebar side="right">
      <SidebarContent>
        <div className="flex flex-col justify-between h-full  pt-6 ">
          <div className="pr-5 pl-8">
            <div className="flex">
              <svg
                width="52"
                height="52"
                viewBox="0 0 52 52"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M27.914 8C34.0825 8.84853 38.7328 11.9488 41.8647 17.3005C44.8173 23.2979 44.7078 29.2429 41.5365 35.1356C38.2774 40.3136 33.5907 43.2315 27.4763 43.889C24.9962 43.889 22.5161 43.889 20.0359 43.889C20.0359 39.9499 20.0359 36.0109 20.0359 32.0719C24.0301 32.1082 28.0056 32.0716 31.9624 31.9625C31.9624 27.9504 31.9624 23.9385 31.9624 19.9265C27.9504 19.9265 23.9385 19.9265 19.9265 19.9265C19.8173 23.8834 19.7808 27.8589 19.8171 31.853C15.8781 31.853 11.939 31.853 8 31.853C8 23.902 8 15.951 8 8C14.638 8 21.276 8 27.914 8Z"
                  fill="#010101"
                />
              </svg>
              <div className="">
                <h2 className="text-lg font-bold">دیتاکس</h2>
                <span className="text-[#71717A]">ورژن ۱.۰.۰</span>
              </div>
            </div>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <span className="flex items-center gap-2">
                    <MessageSquare height={18} color="#71717A" />
                    گفتگوها
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-3">
                    {chatSubjects.map((item, index) => (
                      <div className="flex justify-between" key={index}>
                        <span className="text-[#71717A]">{item}</span>
                        <div className="flex gap-2">
                          <Trash height={18} color="#71717A" />
                          <FilePenIcon height={18} color="#71717A" />
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Link href={"/signup"}>
              <div className="">ثبت نام</div>
            </Link>
          </div>

          <div className="flex flex-col items-center px-3 w-full">
            <div className="flex bg-gray-300 h-px w-full" />
            <div className="bg-black w-full text-white flex items-center rounded-lg gap-3 h-9.5">
              <Unplug height={18} />
              <span> اتصالات داده</span>
            </div>

            <div className="flex items-center rounded-lg text-[#71717A] cursor-pointer  gap-2 h-9.5 justify-start w-full">
              <Settings height={19} />
              <span className="text-gray-600 text-sm font-medium">
                تنظیمات و اعتبار
              </span>
            </div>
            <div className="flex items-center rounded-lg text-[#71717A] cursor-pointer  gap-2 h-9.5 justify-start w-full">
              <LogOut color="red" height={19} />
              <span className="text-gray-600 text-sm font-medium">
                خروج از حساب
              </span>
            </div>

            <div className="flex flex-col h-10 items-center gap-2 pt-3 w-full">
              <div className="flex flex-col gap-1 px-3 w-full">
                <div className="flex items-center gap-2 w-full">
                  <Image
                    // src={session.user?.image || "/images/defaultProfile.png"}
                    src={"/images/defaultProfile.png"}
                    className="rounded-full flex-shrink-0 h-6 w-6"
                    alt="پروفایل کاربر"
                    width={28}
                    height={28}
                  />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-0.5 -mt-1">
                      <span className="flex items-center text-gray-600 text-xs gap-0.5">
                        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                          {/* {session.user?.email} */}test
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex bg-gray-300 h-px mt-3 w-full" />
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
