"use client";

import { useState, useRef, useEffect } from "react";
import { CirclePlus, ArrowUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/Button";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface ChatItem {
  title: string;
  sessionId: string;
}

export default function Home() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [credit, setCredit] = useState<number | null>(null);
  const [isCreditZeroModalOpen, setIsCreditZeroModalOpen] = useState(false);

  const readCredit = () => {
    const raw = localStorage.getItem("userCredit");
    if (raw === null) {
      setCredit(null);
      setIsCreditZeroModalOpen(false);
      return;
    }
    const num = Number(raw);
    if (!isNaN(num)) {
      setCredit(num);
      setIsCreditZeroModalOpen(num <= 0);
    } else {
      setCredit(null);
      setIsCreditZeroModalOpen(false);
    }
  };

  useEffect(() => {
    readCredit();
    window.addEventListener("storage", readCredit);
    window.addEventListener("creditUpdated", readCredit as EventListener);
    return () => {
      window.removeEventListener("storage", readCredit);
      window.removeEventListener("creditUpdated", readCredit as EventListener);
    };
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(
        inputRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMessage = message.trim();

    if (credit !== null && credit <= 0) {
      setError("اعتبار شما به پایان رسیده و امکان ارسال پیام وجود ندارد.");
      return;
    }

    if (!trimmedMessage) {
      setError("پیام نمی‌تواند خالی باشد!");
      return;
    }

    setError("");
    setIsLoading(true);

    const sessionId = uuidv4();
    console.log("Generated sessionId:", sessionId);

    try {
      const chatCounter =
        parseInt(localStorage.getItem("chatCounter") || "0") + 1;
      const title = `گفتگو ${chatCounter}`;
      localStorage.setItem("chatCounter", chatCounter.toString());

      const chatList: ChatItem[] = JSON.parse(
        localStorage.getItem("chatList") || "[]"
      );
      chatList.unshift({ title, sessionId });
      localStorage.setItem("chatList", JSON.stringify(chatList));

      window.dispatchEvent(new Event("chatListUpdated"));

      localStorage.setItem(
        `chat_${sessionId}`,
        JSON.stringify([{ role: "user", content: trimmedMessage }])
      );

      router.push(`/chat/${sessionId}`);
    } catch (err) {
      setError("خطا در ایجاد چت: " + (err as Error).message);
      console.error("Error in handleSubmit:", err);

      const chatList: ChatItem[] = JSON.parse(
        localStorage.getItem("chatList") || "[]"
      );
      const updatedChatList = chatList.filter(
        (chat) => chat.sessionId !== sessionId
      );
      localStorage.setItem("chatList", JSON.stringify(updatedChatList));
      window.dispatchEvent(new Event("chatListUpdated"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute top-0 right-0">
        <SidebarTrigger />
      </div>
      <div className="max-w-[832px] w-full px-4">
        <h1 className="font-bold text-[20px] text-center md:text-right">
          امروز می‌خواهید چه چیزی را تحلیل کنید؟
        </h1>

        <div className="mt-4">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center w-full"
          >
            <div className="flex items-center w-full bg-white border border-[#E4E4E7] rounded-2xl px-3">
              <button
                type="button"
                className="inline-flex items-center justify-center h-6 w-6 rounded-full text-white"
              >
                <CirclePlus className="w-5 h-5 text-slate-400" />
              </button>

              <textarea
                ref={inputRef}
                rows={1}
                placeholder="داده‌ها را متصل کنید و چت را شروع کنید!"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (!isMobile && e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e as unknown as React.FormEvent);
                  }
                }}
                disabled={isLoading || (credit !== null && credit <= 0)}
                className="flex items-center w-full min-h-9 px-2 py-4 text-sm border-none resize-none text-right outline-none max-h-[120px] overflow-hidden"
              />

              <Button
                type="submit"
                disabled={
                  isLoading ||
                  !message.trim() ||
                  (credit !== null && credit <= 0)
                }
                className={`inline-flex items-center justify-center w-9 h-9 rounded-full ${
                  message.trim() &&
                  !isLoading &&
                  !(credit !== null && credit <= 0)
                    ? "bg-[#18181B] text-white"
                    : "bg-[#18181B] text-white opacity-50 cursor-default"
                }`}
              >
                <ArrowUp className="w-6 h-6" />
              </Button>
            </div>
            {error && (
              <p className="text-red-500 text-sm mt-2 text-right">{error}</p>
            )}
          </form>
        </div>
      </div>

      {isCreditZeroModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative bg-white rounded-lg p-6 max-w-sm w-[90%] z-60 shadow-lg text-right">
            <h3 className="text-lg font-semibold mb-2">اعتبار به پایان رسید</h3>
            <p className="text-sm text-gray-700 mb-4">
              اعتبار شما به پایان رسید. تا زمان شارژ مجدد امکان ارسال پیام وجود
              ندارد.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setIsCreditZeroModalOpen(false)}
                className="px-3 py-1 rounded bg-gray-100"
              >
                باشه
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
