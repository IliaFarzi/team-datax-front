"use client";
import {
  FilePenIcon,
  LogOut,
  MessageSquare,
  Settings,
  Unplug,
  Trash,
  Plus,
  EllipsisVertical,
} from "lucide-react";
import Cookies from "js-cookie";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "../Button";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

interface ChatItem {
  title: string;
  sessionId: string;
}

export function AppSidebar() {
  const [chatList, setChatList] = useState<ChatItem[]>([]);
  const [editChatIndex, setEditChatIndex] = useState<number | null>(null);
  const [editChatTitle, setEditChatTitle] = useState<string>("");
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const editInputRef = useRef<HTMLInputElement>(null);

  const [credit, setCredit] = useState<number | null>(null);

  const maxCredit: number = 2000;
  const readCredit = useCallback(() => {
    const raw = localStorage.getItem("userCredit");
    if (raw === null) {
      setCredit(null);
      return;
    }
    const num = Number(raw);
    if (!isNaN(num)) {
      setCredit(num);
    } else {
      setCredit(null);
    }
  }, []);

  useEffect(() => {
    readCredit();
    window.addEventListener("storage", readCredit);
    window.addEventListener("creditUpdated", readCredit as EventListener);
    return () => {
      window.removeEventListener("storage", readCredit);
      window.removeEventListener("creditUpdated", readCredit as EventListener);
    };
  }, [readCredit]);

  const remainderCredit = credit ?? 500;

  const creditInfo =
    credit !== null
      ? {
          max: maxCredit,
          percent: Math.max(0, Math.min(100, (credit / maxCredit) * 100)),
        }
      : {
          current: remainderCredit,
          max: maxCredit,
          percent: Math.max(
            0,
            Math.min(100, (remainderCredit / maxCredit) * 100)
          ),
        };

  const loadChatList = useCallback(() => {
    const storedChatList: ChatItem[] = JSON.parse(
      localStorage.getItem("chatList") || "[]"
    );
    setChatList((prev) => {
      if (JSON.stringify(prev) !== JSON.stringify(storedChatList)) {
        return storedChatList;
      }
      return prev;
    });
  }, []);

  useEffect(() => {
    const email = Cookies.get("user_email");
    setUserEmail(email || "");
    loadChatList();

    window.addEventListener("chatListUpdated", loadChatList);
    return () => {
      window.removeEventListener("chatListUpdated", loadChatList);
    };
  }, [loadChatList]);

  const handleDeleteChat = useCallback(
    (index: number) => {
      const sessionIdToDelete = chatList[index].sessionId;
      const updatedList = chatList.filter((_, i) => i !== index);
      localStorage.removeItem(`chat_${sessionIdToDelete}`);
      localStorage.setItem("chatList", JSON.stringify(updatedList));
      setChatList(updatedList);
      window.dispatchEvent(new Event("chatListUpdated"));
    },
    [chatList]
  );

  const logoutAccount = () => {
    router.push("/login");
    Cookies.remove("access_token");
    Cookies.remove("user_email");
    toast({
      variant: "success",
      description: "شما با موفقیت از حساب کاربری خارج شدید.",
      duration: 3000,
    });
  };

  const handleEditChat = useCallback((index: number, title: string) => {
    setEditChatIndex(index);
    setEditChatTitle(title);
  }, []);

  const handleSaveEdit = useCallback(
    (index: number) => {
      if (editChatTitle.trim()) {
        const updatedList = chatList.map((item, i) =>
          i === index ? { ...item, title: editChatTitle } : item
        );
        localStorage.setItem("chatList", JSON.stringify(updatedList));
        setChatList(updatedList);
        window.dispatchEvent(new Event("chatListUpdated"));
      }
      setEditChatIndex(null);
      setEditChatTitle("");
    },
    [editChatTitle, chatList]
  );

  const handleCancelEdit = useCallback(() => {
    setEditChatIndex(null);
    setEditChatTitle("");
  }, []);

  useEffect(() => {
    if (editChatIndex !== null && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editChatIndex]);

  const isConnectorsActive = pathname === "/connectors";

  const formatUSD = (n: number | null) => {
    if (n === null) return "-";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);
  };

  return (
    <Sidebar side="right" className="h-screen overflow-hidden">
      <SidebarContent className="overflow-hidden">
        <div className="flex flex-col justify-between h-full">
          <div className="flex-1 max-h-full overflow-hidden">
            <div className="flex mt-5 mx-4">
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
              <div>
                <h2 className="text-lg font-bold">دیتاکس</h2>
                <span className="text-[#71717A]">ورژن ۱.۰.۰</span>
              </div>
            </div>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1" className="m-2">
                <Link href="/chat">
                  <Button
                    variant="outline"
                    className="bg-transparent w-full h-9"
                  >
                    <span className="text-[14px]">گفتگو جدید</span>
                    <Plus />
                  </Button>
                </Link>
                <AccordionTrigger>
                  <span className="flex items-center text-[16px] gap-2 text-[#71717A]">
                    <MessageSquare height={18} color="#71717A" />
                    گفتگوها
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col mr-2 gap-3 border-r border-[#E4E4E7] pr-5">
                    {chatList.length === 0 && (
                      <p className="text-[#71717A] text-center">
                        هیچ گفتگویی موجود نیست.
                      </p>
                    )}
                    {chatList.map((item, index) => (
                      <div
                        className="flex justify-between items-center"
                        key={index}
                      >
                        {editChatIndex === index ? (
                          <div className="relative w-full">
                            <Input
                              ref={editInputRef}
                              value={editChatTitle}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => setEditChatTitle(e.target.value)}
                              onKeyDown={(
                                e: React.KeyboardEvent<HTMLInputElement>
                              ) => {
                                if (e.key === "Enter") handleSaveEdit(index);
                                if (e.key === "Escape") handleCancelEdit();
                              }}
                              onBlur={() => handleSaveEdit(index)}
                              placeholder="عنوان گفتگو"
                              className="text-[#71717A] mb-2"
                              autoFocus
                            />
                          </div>
                        ) : (
                          <>
                            <Link
                              href={`/chat/${item.sessionId}`}
                              className="text-[#71717A] text-[16px]"
                            >
                              {item.title}
                            </Link>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <EllipsisVertical
                                  height={18}
                                  color="#71717A"
                                  className="cursor-pointer"
                                  aria-label="گزینه‌ها"
                                />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                className="w-[192px]"
                                align="end"
                              >
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleEditChat(index, item.title)
                                  }
                                  className="flex items-center justify-between cursor-pointer flex-row-reverse"
                                >
                                  ویرایش
                                  <FilePenIcon height={18} color="#18181B" />
                                </DropdownMenuItem>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <DropdownMenuItem
                                      onSelect={(e) => e.preventDefault()}
                                      className="flex items-center justify-between cursor-pointer flex-row-reverse"
                                    >
                                      حذف
                                      <Trash height={18} color="#EF4444" />
                                    </DropdownMenuItem>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-[425px] md:w-500">
                                    <DialogHeader>
                                      <DialogTitle>حذف گفتگو</DialogTitle>
                                      <DialogDescription>
                                        آیا مطمئن هستید که می‌خواهید گفتگو{" "}
                                        {item.title} را حذف کنید؟
                                      </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                      <DialogClose asChild>
                                        <Button className="bg-[#FAFAFA] text-[#18181B] w-[50%] hover:bg-gray-100">
                                          انصراف
                                        </Button>
                                      </DialogClose>
                                      <DialogClose asChild>
                                        <Button
                                          onClick={() =>
                                            handleDeleteChat(index)
                                          }
                                          className="bg-[#DC2626] hover:bg-[#DC2626] w-[50%]"
                                        >
                                          حذف
                                        </Button>
                                      </DialogClose>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="flex flex-col items-center px-3">
            <div className="flex w-full bg-[#E4E4E7] mb-2" />
            <div
              className={`w-full flex items-center rounded-lg gap-3 h-9.5 ${
                isConnectorsActive
                  ? "text-black bg-[#E4E4E7]"
                  : "text-[#71717A]"
              }`}
            >
              <Unplug
                height={18}
                color={isConnectorsActive ? "black" : "#71717A"}
              />
              <Link href="/connectors">
                <span>اتصالات داده</span>
              </Link>
            </div>

            <div className="flex items-center rounded-lg text-[#71717A] cursor-pointer gap-2 h-9.5 justify-start w-full">
              <Settings height={19} />
              <Dialog>
                <DialogTrigger>تنظیمات و اعتبار</DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>اعتبار فعلی</DialogTitle>
                    <DialogDescription>
                      <div dir="ltr" className="flex flex-col gap-2">
                        <span className="text-[14px] text-gray-500">
                          برای افزایش اعتبار با تیم فروش ما در واتساپ یا تلگرام
                          به شماره 09105860050 ارتباط بگیرید{" "}
                        </span>

                        <div className="w-full bg-gray-200 rounded-full h-4 mt-3 overflow-hidden relative">
                          <p
                            className="bg-[#09090B] h-4 rounded-l-full rounded-r-none transition-all"
                            style={{
                              width: `${creditInfo.percent}%`,
                              minWidth: "4px",
                            }}
                          />
                          {remainderCredit === 0 && (
                            <span className="absolute inset-0 flex items-center justify-center text-xs text-gray-500">
                              اعتبار صفر است
                            </span>
                          )}
                        </div>

                        <span className="text-xs text-gray-500 mt-1">
                          {formatUSD(remainderCredit)} /
                          {formatUSD(creditInfo.max)}
                        </span>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex items-center rounded-lg text-[#71717A] cursor-pointer gap-2 h-9.5 justify-start w-full">
              <LogOut color="red" height={19} />
              <Dialog>
                <DialogTrigger asChild>
                  <span>خروج از حساب</span>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>خروج از حساب</DialogTitle>
                    <DialogDescription>
                      آیا مطمئن هستید که می‌خواهید از حساب کاربری خود خارج شوید؟
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button className="bg-[#FAFAFA] text-[#18181B] w-[50%] hover:bg-gray-100">
                        انصراف
                      </Button>
                    </DialogClose>
                    <Button
                      onClick={logoutAccount}
                      type="submit"
                      className="bg-[#DC2626] hover:bg-[#DC2626] w-[50%]"
                    >
                      خروج
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="flex flex-col h-9 items-center gap-2 mt-2 w-full">
              <div className="flex flex-col gap-1 w-full">
                <div className="flex items-center gap-2 w-full">
                  <svg
                    width="31"
                    height="31"
                    viewBox="0 0 36 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 18C0 8.05888 8.05888 0 18 0C27.9411 0 36 8.05888 36 18C36 27.9411 27.9411 36 18 36C8.05888 36 0 27.9411 0 18Z"
                      fill="#18181B"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M18 11.3332C16.6193 11.3332 15.5 12.4525 15.5 13.8332C15.5 15.2139 16.6193 16.3332 18 16.3332C19.3807 16.3332 20.5 15.2139 20.5 13.8332C20.5 12.4525 19.3807 11.3332 18 11.3332ZM13.8333 13.8332C13.8333 11.532 15.6988 9.6665 18 9.6665C20.3012 9.6665 22.1667 11.532 22.1667 13.8332C22.1667 16.1344 20.3012 17.9999 18 17.9999C15.6988 17.9999 13.8333 16.1344 13.8333 13.8332ZM12.5537 20.887C13.3351 20.1056 14.3949 19.6666 15.5 19.6666H20.5C21.6051 19.6666 22.6649 20.1056 23.4463 20.887C24.2277 21.6684 24.6667 22.7282 24.6667 23.8333V25.5C24.6667 25.9602 24.2936 26.3333 23.8334 26.3333C23.3731 26.3333 23 25.9602 23 25.5V23.8333C23 23.1703 22.7366 22.5344 22.2678 22.0655C21.7989 21.5967 21.1631 21.3333 20.5 21.3333H15.5C14.8369 21.3333 14.201 21.5967 13.7322 22.0655C13.2633 22.5344 12.9999 23.1703 12.9999 23.8333V25.5C12.9999 25.9602 12.6268 26.3333 12.1666 26.3333C11.7064 26.3333 11.3333 25.9602 11.3333 25.5V23.8333C11.3333 22.7282 11.7722 21.6684 12.5537 20.887Z"
                      fill="white"
                    />
                  </svg>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-0.5">
                      <div className="flex items-center text-xs gap-0.5">
                        <div className="text-[#3F3F46] font-medium">
                          {userEmail}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
