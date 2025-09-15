"use client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";
import { useState } from "react";

export const NavigationSheet = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="h-[354px]">
        <div className="flex flex-col ">
          <div className="flex items-center justify-between mb-6">
            <Logo />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <Menu />
            </Button>
          </div>
          <NavMenu orientation="vertical" className="mt-12" />
          <div className="mt-auto space-y-4">
            <Button
              variant="outline"
              className="w-[140px] text-[14px] sm:hidden"
              onClick={() => setIsOpen(false)}
            >
              ورود
            </Button>
            <Button
              className="w-[140px] text-[14px] xs:hidden"
              onClick={() => setIsOpen(false)}
            >
              رایگان امتحان کنید
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
