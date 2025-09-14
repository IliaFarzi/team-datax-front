import { Button } from "@/components/ui/button";
import { NavMenu } from "./nav-menu";
import { Logo } from "./logo";
import { NavigationSheet } from "./navigation-sheet";
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
            <NavigationSheet />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
