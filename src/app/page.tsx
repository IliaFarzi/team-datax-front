"use client";

import { useState } from "react";
import { CirclePlus, ArrowUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      setError("پیام نمی‌تواند خالی باشد!");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const sessionId = uuidv4();
      console.log("Generated sessionId:", sessionId); // برای دیباگ

      localStorage.setItem(
        `chat_${sessionId}`,
        JSON.stringify([{ role: "user", content: trimmedMessage }])
      );

      router.push(`/chat/${sessionId}`);
    } catch (err) {
      setError("خطایی رخ داد: " + (err as Error).message);
      console.error("Error in handleSubmit:", err); // برای دیباگ
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center">
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
                rows={1}
                placeholder="داده‌ها را متصل کنید و چت را شروع کنید!"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e as unknown as React.FormEvent);
                  }
                }}
                className="flex items-center w-full min-h-9 px-2 py-4 text-sm border-none resize-none text-right outline-none"
              />

              <button
                type="submit"
                disabled={isLoading || !message.trim()}
                className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  message.trim() && !isLoading
                    ? "bg-[#18181B] text-white"
                    : "bg-[#18181B] text-white opacity-50 cursor-default"
                }`}
              >
                <ArrowUp className="w-6 h-6" />
              </button>
            </div>
            {error && (
              <p className="text-red-500 text-sm mt-2 text-right">{error}</p>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}
