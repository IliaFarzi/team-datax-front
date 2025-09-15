import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { NavMenu } from "./nav-menu";
import { Logo } from "./logo";
import { Menu } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="fixed z-10 top-6 inset-x-4 h-14 xs:h-16 bg-background/50 backdrop-blur-sm border dark:border-slate-700/70 max-w-screen-xl mx-auto rounded-full">
      <div className="h-full flex items-center justify-between mx-auto px-4">
        <div className="flex items-center gap-2">
          <Logo />
          <h1>دیتاکس</h1>
        </div>
        {/* Desktop Menu */}
        <NavMenu className="hidden md:block" />

        <div className="flex items-center gap-3">
          <Link href={"/login"}>
            <Button variant="outline" className="hidden sm:inline-flex">
              ورود
            </Button>
          </Link>
          <Link href={"/signup"}>
            <Button className="hidden md:inline-flex">
              ثبت نام در لیست انتظار
            </Button>
          </Link>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <DropdownMenu dir="rtl">
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Menu />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-64 rounded-3xl p-4 bg-white shadow-lg border-none"
                align="end"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Logo />
                    <h1 className="font-bold">دیتاکس</h1>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2 text-gray-700">
                  <DropdownMenuItem className="justify-end">
                    <Link href="#testimonials">نظرات مشتریان</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="justify-end">
                    <Link href="#faq">سوالات پرتکرار</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="justify-end">
                    <Link href="#pricing">قیمت‌گذاری</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="justify-end">
                    <Link href="#features">امکانات</Link>
                  </DropdownMenuItem>
                </div>
                <div className="mt-6 flex items-center ">
                  <Link className="" href={"/login"}>
                    <Button
                      variant="outline"
                      className=" rounded-full border-black text-black text-[14px]"
                    >
                      ورود
                    </Button>
                  </Link>
                  <div className="w-[48%] px-4 py-2 rounded-full text-white text-[13px]">
                    <Link href={"/signup"}>
                      <Button className="">رایگان امتحان کنید</Button>
                    </Link>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
