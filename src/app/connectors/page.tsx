"use client";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type Connector = {
  id: string;
  name: string;
  nameFA: string;
  type: string;
  typeFA: string;
  icon: string;
  isNew?: boolean;
  link?: string;
};

const connectors: Connector[] = [
  {
    id: "google-sheets",
    name: "Google Sheets",
    nameFA: "گوگل شیت",
    type: "Integration",
    typeFA: "جدول‌های گوگل شیت خود را تحلیل کنید.",
    icon: "/images/googleSheet.png",
    isNew: true,
  },
];

export default function Connectors() {
  const [isConnected, setIsConnected] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const success = searchParams.get("success");
    if (success) {
      setIsConnected(true);
    }
  }, [searchParams]);

  const handleConnect = useCallback(async () => {
    try {
      const base =
        (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "") || "";
      window.location.href = `${base}/auth/connect-google-sheets`;
    } catch (err) {
      console.error("Failed to start connection flow:", err);
      alert("خطا در شروع فرایند اتصال. کنسول رو بررسی کن.");
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className=" mx-auto px-6 py-6">
        <div className="border-b border-slate-200 pb-1 mb-6">
          <h1 className="text-[24px] flex justify-end md:justify-start font-semibold">
            اتصالات داده
          </h1>
          <h2 className="hidden md:block text-[#71717A] text-[14px] ">
            دیتاکس را به نرم‌افزارها و اطلاعات‌تان متصل کنید
          </h2>
        </div>

        <div className="w-auto mx-auto">
          <div className="space-y-4  md:mr-26">
            <h2 className="text-xl font-semibold tracking-tight">
              افزودن اتصالات
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {connectors.map((connector) => (
                <button
                  key={connector.id}
                  onClick={() => handleConnect()}
                  className="text-right bg-white max-w-[312px] border  border-slate-200 rounded-xl overflow-hidden p-0"
                  type="button"
                >
                  <div className="pr-3 pb-3  justify-between h-[108px] flex">
                    <div className="flex items-center gap-3">
                      <Image
                        src={connector.icon}
                        alt={connector.nameFA}
                        width={40}
                        height={40}
                        className={`${isConnected ? "mb-8" : ""}`}
                      />
                      <div>
                        <h3 className="font-medium tracking-tight">
                          {connector.nameFA}
                        </h3>
                        <p className="text-xs text-[#09090B] tracking-tight">
                          {connector.typeFA}
                        </p>
                        {isConnected && (
                          <p className="text-xs text-[#047857] bg-[#0596691A] w-fit rounded-md px-2 py-0.5 mt-5 font-medium">
                            متصل
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="self-end w-10 h-8 bg-black flex justify-center items-center rounded-lg ml-3">
                      <ArrowLeft color="white" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
