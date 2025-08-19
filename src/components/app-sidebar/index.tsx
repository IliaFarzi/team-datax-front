import {
  FilePenIcon,
  LogOut,
  MessageSquare,
  Settings,
  Unplug,
  Trash,
  Plus,
} from "lucide-react";
import Image from "next/image";

import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState, useEffect } from "react";
import { Button } from "../Button";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AppSidebar() {
  const chatSubjects = ["شروع مکالمه", "سلام وقت بخیر", "تحلیل دیتای مالی"];
  // const [userEmail, setUserEmail] = useState("");
  const [userPicture, setUserPicture] = useState("/images/defaultProfile.png");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const email = localStorage.getItem("user_email");
    const picture =
      localStorage.getItem("user_picture") || "/images/defaultProfile.png";
    if (token && email) {
      // setUserEmail(email);
      setUserPicture(picture);
    }
  }, []);

  return (
    <Sidebar side="right">
      <SidebarContent>
        <div className="flex flex-col justify-between h-full  ">
          <div className="">
            <div className="flex mt-5.5 mx-4">
              <svg
                width="52"
                height="52"
                viewBox="0 0 52 52"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
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
              <AccordionItem value="item-1" className="m-2">
                <Link href={"/"}>
                  <Button
                    variant={"outline"}
                    className="bg-transparent w-full h-9 "
                  >
                    <span className="text-[14px]">گفتگو جدید</span>
                    <Plus />
                  </Button>
                </Link>
                <AccordionTrigger>
                  {/* <Link href={"/chat"}> */}
                  <span className="flex items-center gap-2 text-[#71717A] ">
                    <MessageSquare height={18} color="#71717A" />
                    گفتگوها
                  </span>
                  {/* </Link> */}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col mr-2 gap-3 border-r border-[#E4E4E7] pr-5.5">
                    {chatSubjects.map((item, index) => (
                      <div className="flex justify-between" key={index}>
                        <span className="text-[#71717A]">{item}</span>
                        <div className="flex gap-2">
                          <FilePenIcon height={18} color="#71717A" />
                          <Dialog>
                            <form>
                              <DialogTrigger asChild>
                                <Trash height={18} color="#71717A" />
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>حذف گفتگو</DialogTitle>
                                  <DialogDescription>
                                    آیا مطمئن هستید که می‌خواهید گفتگو فلان را
                                    حذف کنید؟
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button className="bg-[#FAFAFA] text-[#18181B] w-[50%] hover:bg-gray-100">
                                      انصراف
                                    </Button>
                                  </DialogClose>
                                  <Button
                                    type="submit"
                                    className="bg-[#DC2626] hover:bg-[#DC2626] w-[50%]"
                                  >
                                    خروج
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </form>
                          </Dialog>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="flex flex-col items-center px-3 w-full">
            <div className="flex  h-px w-full" />
            <div className=" w-full text-[#71717A] flex items-center rounded-lg gap-3 h-9.5">
              <Unplug height={18} />
              <Link href={"/connectors"}>
                <span> اتصالات داده</span>
              </Link>
            </div>

            <div className="flex items-center rounded-lg text-[#71717A] cursor-pointer  gap-2 h-9.5 justify-start w-full">
              <Settings height={19} />
              <Dialog>
                <DialogTrigger>تنظیمات و اعتبار</DialogTrigger>
                <DialogContent height="128px">
                  <DialogHeader>
                    <DialogTitle>اعتبار فعلی</DialogTitle>
                    <DialogDescription>
                      <p>اعتبار فعلی شما 12,000,000 تومان می باشد</p>
                      <p>برای افزایش اعتبار با 09105860050 تماس بگیرید</p>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex items-center rounded-lg text-[#71717A] cursor-pointer  gap-2 h-9.5 justify-start w-full">
              <LogOut color="red" height={19} />
              <Dialog>
                <form>
                  <DialogTrigger asChild>
                    <span>خروج از حساب</span>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>خروج از حساب</DialogTitle>
                      <DialogDescription>
                        آیا مطمئن هستید که می‌خواهید از حساب کاربری خود خارج
                        شوید؟
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button className="bg-[#FAFAFA] text-[#18181B] w-[50%] hover:bg-gray-100">
                          انصراف
                        </Button>
                      </DialogClose>
                      <Button
                        type="submit"
                        className="bg-[#DC2626] hover:bg-[#DC2626] w-[50%]"
                      >
                        خروج
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </form>
              </Dialog>
            </div>

            <div className="flex flex-col h-9 items-center gap-2 mt-[14px] w-full">
              <div className="flex flex-col gap-1  w-full">
                <div className="flex items-center gap-2 w-full">
                  <Image
                    src={userPicture}
                    className="rounded-full flex-shrink-0 h-6 w-6"
                    alt="پروفایل کاربر"
                    width={28}
                    height={28}
                  />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-0.5 mt-1">
                      <span className="flex items-center  text-xs gap-0.5">
                        <span className="text-[#3F3F46] font-medium">
                          t.hosseinpour2347@gmail.com
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex  mt-3 w-full" />
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
