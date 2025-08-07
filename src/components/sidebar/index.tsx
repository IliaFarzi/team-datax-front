"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  Plus,
  MessageSquare,
  ChevronRight,
  Search,
  MoreVertical,
  Notebook,
  Files,
  Unplug,
  Mail,
  BookOpen,
  Users,
  FlaskConical,
  Zap,
  Settings,
  LogOut,
  X,
  Menu,
} from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function Sidebar({
  isCollapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const [isPersonalWorkspaceOpen, setIsPersonalWorkspaceOpen] = useState(true);
  const [isChatThreadsOpen, setIsChatThreadsOpen] = useState(false);
  const [showDataConnector, setShowDataConnector] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: session, status } = useSession();

  const chatThreads = [
    { id: "1", title: "درخواست کمک", category: "امروز" },
    { id: "2", title: "درخواست کمک مکالمه", category: "هفته گذشته" },
  ];

  const dataConnectors = [
    {
      name: "Google Drive",
      logo: "https://julius.ai/_next/image?url=https%3A%2F%2Fr2.julius.ai%2Fgoogledrive-logo.png&w=32&q=75",
    },
    {
      name: "BigQuery",
      logo: "https://julius.ai/_next/image?url=https%3A%2F%2Fr2.julius.ai%2Fbigquery-logo.png&w=32&q=75",
    },
    {
      name: "Postgres",
      logo: "https://julius.ai/_next/image?url=https%3A%2F%2Fr2.j Atual.ai%2Fpostgres-logo.png&w=32&q=75",
    },
    {
      name: "Snowflake",
      logo: "https://julius.ai/_next/image?url=https%3A%2F%2Fr2.julius.ai%2Fsnowflake-logo.png&w=32&q=75",
    },
  ];

  if (status === "loading") {
    return <p className="p-3 text-gray-600">در حال بارگذاری...</p>;
  }

  if (!session) {
    return <p className="p-3 text-gray-600 fixed">لطفاً وارد شوید.</p>;
  }

  return (
    <nav
      className={`h-screen bg-gray-50 flex flex-col transition-all duration-300 ${
        isCollapsed
          ? "w-12 md:w-12"
          : "w-[265px] fixed md:static md:w-[265px] z-100"
      }`}
      dir="rtl"
    >
      <div className="flex flex-col h-full overflow-hidden relative">
        {/* دکمه باز/بستن */}
        <div className="flex items-center justify-between px-3 py-3">
          {!isCollapsed && (
            <Link
              href="/"
              className="text-blue-600 cursor-pointer text-2xl font-bold tracking-tight"
            >
              جولیوس
            </Link>
          )}
          <button
            onClick={onToggleCollapse}
            className="fixed top-3 right-3 md:static rounded-lg duration-100 active:opacity-80 active:shadow-none border border-gray-300 dark:text-white border-input hover:dark:bg-accent hover:text-accent-foreground px-1 z-150 "
          >
            {isCollapsed ? (
              <Menu className="w-6 h-6 text-gray-600" />
            ) : (
              <X className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* محتوای سایدبار */}
        {!isCollapsed && (
          <div className="flex-1 overflow-y-auto px-3">
            <Link href="/chat">
              <button className="flex items-center justify-center mx-3 mb-4 bg-white border border-gray-300 rounded-lg h-9 px-3 gap-2 shadow-sm hover:shadow-md transition-shadow">
                <Plus className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium">جدید</span>
              </button>
            </Link>

            <nav className="flex-1" aria-label="اصلی">
              <ul className="flex flex-col gap-1 justify-center">
                <div className="flex flex-col">
                  <button
                    onClick={() =>
                      setIsPersonalWorkspaceOpen(!isPersonalWorkspaceOpen)
                    }
                    className="flex items-center justify-between text-center bg-transparent border-transparent cursor-pointer"
                  >
                    <div className="flex flex-col text-gray-500 text-xs font-medium mt-4">
                      <h1 className="flex items-center gap-2 text-gray-500 text-xs font-medium">
                        <div className="flex items-center gap-2">
                          <span>فضای کاری شخصی</span>
                          <ChevronRight
                            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                              isPersonalWorkspaceOpen ? "rotate-90" : ""
                            }`}
                          />
                        </div>
                      </h1>
                    </div>
                  </button>

                  {isPersonalWorkspaceOpen && (
                    <div>
                      <button
                        onClick={() => setIsChatThreadsOpen(!isChatThreadsOpen)}
                        className="flex items-center justify-between text-center bg-transparent border-transparent cursor-pointer"
                      >
                        <li className="flex items-center rounded-lg text-gray-600 cursor-pointer text-sm gap-3 py-1.5 px-3 w-full">
                          <MessageSquare className="w-4 h-4 flex-shrink-0 text-gray-600" />
                          <div className="flex cursor-pointer text-sm gap-1 text-center w-full">
                            <div className="flex items-center justify-between w-full">
                              <div className="flex gap-1">
                                <span className="text nowrap whitespace-nowrap">
                                  موضوعات گفتگو
                                </span>
                                <span>
                                  <span>(</span>
                                  <span>2</span>
                                  <span>)</span>
                                </span>
                              </div>
                              <ChevronRight
                                className={`w-4 h-4 transition-transform duration-200 ${
                                  isChatThreadsOpen ? "rotate-90" : ""
                                }`}
                              />
                            </div>
                          </div>
                        </li>
                      </button>

                      {/* {isChatThreadsOpen && (
                        <ul className="h-0">
                          <div className="pr-6 relative max-h-[230px] overflow-auto">
                            <div className="flex items-center bg-gray-50 rounded-lg gap-2 px-3 py-1 relative mb-2 mt-2">

                            </div>

                            <span className="bg-gray-50 text-gray-500 text-xs py-2 sticky top-0 w-full">
                              امروز
                            </span>
                            <li className="flex items-start rounded-md text-gray-600 cursor-pointer text-xs font-semibold gap-2 justify-between mr-2 px-2 py-1">
                              <div className="flex items-start rounded-md justify-between w-full">
                                <div className="flex justify-between w-full self-center">
                                  <div className="text-gray-600 text-xs font-semibold overflow-hidden text-ellipsis whitespace-nowrap w-full">
                                    <div className="flex items-center text-nowrap whitespace-nowrap"></div>
                                  </div>
                                  <button className="text-gray-500 bg-transparent border-transparent cursor-pointer text-center">
                                    <MoreVertical className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                  </button>
                                </div>
                              </div>
                            </li>

                            <div className="flex py-1 relative w-full">
                              <span className="bg-gray-50 text-gray-500 text-xs py-2 sticky top-0 w-full">
                                هفته گذشته
                              </span>
                            </div>
                            <li className="flex items-start rounded-md text-gray-600 cursor-pointer text-xs font-semibold gap-2 justify-between mr-2 px-2 py-1">
                              <div className="flex items-start rounded-md justify-between w-full">
                                <div className="flex justify-between w-full self-center">
                                  <div className="text-gray-600 text-xs font-semibold overflow-hidden text-ellipsis whitespace-nowrap w-full">
                                    <div className="flex items-center text-nowrap whitespace-nowrap">
                                      <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                                        درخواست کمک مکالمه
                                      </span>
                                    </div>
                                  </div>
                                  <button className="text-gray-500 bg-transparent border-transparent cursor-pointer text-center">
                                    <MoreVertical className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                  </button>
                                </div>
                              </div>
                            </li>
                          </div>
                        </ul>
                      )} */}

                      <Link
                        href="/not-found"
                        className="flex items-center rounded-lg text-gray-600 cursor-pointer text-sm gap-3 py-1.5 px-3"
                      >
                        <Notebook className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="flex gap-1">
                          <span>دفترچه‌ها</span>
                          <span className="text-gray-600">
                            <span>(</span>
                            <span>3</span>
                            <span>)</span>
                          </span>
                        </span>
                      </Link>

                      <Link
                        href="/not-found"
                        className="flex items-center rounded-lg text-gray-600 cursor-pointer text-sm gap-3 py-1.5 px-3"
                      >
                        <Files className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span>فایل‌ها</span>
                      </Link>

                      <Link
                        href="/not-found"
                        className="flex items-center rounded-lg text-gray-600 cursor-pointer text-sm gap-3 py-1.5 px-3"
                      >
                        <Unplug className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span>اتصال‌دهنده‌های داده</span>
                      </Link>

                      <li className="flex items-center rounded-lg text-gray-600 cursor-pointer text-sm gap-3 py-1.5 px-3 text-left w-full">
                        <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <div className="flex gap-1 text-left w-full">
                          <div className="flex items-center justify-between w-full">
                            <span className="text-nowrap whitespace-nowrap">
                              صندوق ورودی
                            </span>
                          </div>
                        </div>
                      </li>
                    </div>
                  )}
                </div>

                <div className="flex flex-col text-gray-500 text-xs font-medium mt-4">
                  <h1 className="flex items-center gap-2 text-gray-500 text-xs font-medium">
                    منابع
                  </h1>
                </div>

                <Link
                  href="/not-found"
                  className="flex items-center rounded-lg text-gray-600 cursor-pointer text-sm gap-3 py-1.5 px-3"
                >
                  <BookOpen className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span>مستندات</span>
                </Link>

                <a
                  href="https://community.julius.ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center rounded-lg text-gray-600 cursor-pointer text-sm gap-3 py-1.5 px-3"
                >
                  <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span>انجمن جامعه</span>
                </a>

                <Link
                  href="/not-found"
                  className="flex items-center rounded-lg text-gray-600 cursor-pointer text-sm gap-3 py-1.5 px-3"
                >
                  <FlaskConical className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span>آزمایشگاه مدل‌ها</span>
                </Link>

                <Link
                  href="/not-found"
                  className="flex items-center rounded-lg text-gray-600 cursor-pointer text-sm gap-3 py-1.5 px-3"
                >
                  <Zap className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span>ارتقای اشتراک</span>
                </Link>
              </ul>
            </nav>

            <div className="flex flex-col items-center px-3 w-full">
              {showDataConnector && (
                <div className="flex flex-col bg-gray-100 border border-gray-300 rounded-lg relative w-full px-3 py-6 mb-4 mt-4">
                  <button
                    onClick={() => setShowDataConnector(false)}
                    className="absolute left-2 top-2 flex items-center justify-center rounded-lg text-gray-600 cursor-pointer text-sm font-medium h-6 w-6 bg-transparent border-transparent transition-colors hover:bg-gray-200"
                  >
                    <X className="h-4 w-4" />
                  </button>

                  <div className="flex items-center justify-evenly mb-4 w-full">
                    {dataConnectors.map((connector, index) => (
                      <span
                        key={index}
                        className="flex items-center justify-center"
                      >
                        <Image
                          alt={connector.name}
                          width={32}
                          height={32}
                          src={connector.logo}
                          className="w-8 h-8 object-contain"
                        />
                      </span>
                    ))}
                  </div>

                  <div className="w-full">
                    <Link
                      href="/not-found"
                      className="flex items-center justify-center bg-white border border-gray-300 rounded-lg cursor-pointer text-sm font-medium gap-2 h-8 px-3 relative w-full hover:shadow-md transition-shadow"
                    >
                      <div className="cursor-pointer text-sm font-medium text-center relative overflow-hidden text-ellipsis whitespace-nowrap">
                        تنظیم اتصال داده
                      </div>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}

              <div className="flex bg-gray-300 h-px mb-3 w-full" />

              <button className="flex items-center rounded-lg text-gray-600 cursor-pointer text-sm font-medium gap-2 h-7 justify-start px-3 py-0.5 transition-colors hover:bg-gray-100 w-full">
                <Settings className="flex-shrink-0 w-4 h-4" />
                <Link
                  href="/not-found"
                  className="text-gray-600 text-sm font-medium text-left w-full"
                >
                  حساب و صورتحساب
                </Link>
              </button>

              <button className="flex items-center rounded-lg text-gray-600 cursor-pointer text-sm font-medium gap-2 h-7 justify-start px-3 py-0.5 transition-colors hover:bg-gray-100 w-full">
                <LogOut className="flex-shrink-0 w-4 h-4" />
                <span
                  onClick={onToggleCollapse}
                  className="text-gray-600 text-sm font-medium text-left w-full"
                >
                  خروج
                </span>
              </button>

              <div className="flex flex-col items-center gap-2 pt-3 w-full">
                <div className="flex flex-col gap-1 px-3 w-full">
                  <div className="flex items-center gap-2 w-full">
                    <Image
                      src={"/images/defaultProfile.png"}
                      className="rounded-full flex-shrink-0 h-6 w-6"
                      alt="پروفایل کاربر"
                      width={28}
                      height={28}
                    />
                    <div className="flex flex-col">
                      <span className="text-black text-sm font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                        test
                      </span>
                      <div className="flex items-center gap-0.5 -mt-1">
                        <span className="flex items-center text-gray-600 text-xs gap-0.5">
                          <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                            a@email.com
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex bg-gray-300 h-px mt-3 w-full" />

              <div className="flex flex-1 items-center justify-between mb-3 mt-3 w-full">
                <div className="flex items-center gap-1">
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://julius.ai/iphone"
                    className="rounded-full text-gray-400 cursor-pointer px-1 py-1"
                  >
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 384 512"
                      fill="currentColor"
                    >
                      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                    </svg>
                  </a>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://julius.ai/android"
                    className="rounded-full text-gray-400 cursor-pointer px-1 py-1"
                  >
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 576 512"
                      fill="currentColor"
                    >
                      <path d="M420.55,301.93a24,24,0,1,1,24-24,24,24,0,0,1-24,24m-265.1,0a24,24,0,1,1,24-24,24,24,0,0,1-24,24m273.7-144.48,47.94-83a10,10,0,1,0-17.27-10h0l-48.54,84.07a301.25,301.25,0,0,0-246.56,0L116.18,64.45a10,10,0,1,0-17.27,10h0l47.94,83C64.53,202.22,8.24,285.55,0,384H576c-8.24-98.45-64.54-181.78-146.85-226.55" />
                    </svg>
                  </a>
                </div>

                <div className="flex items-center gap-1">
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://x.com/JuliusAI_"
                    className="flex items-center justify-center rounded-full text-gray-400 cursor-pointer h-7 w-7 px-1 py-1"
                  >
                    <span className="sr-only">ایکس</span>
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 512 462.799"
                      fill="currentColor"
                    >
                      <path
                        fillRule="nonzero"
                        d="M403.229 0h78.506L310.219 196.04 512 462.799H354.002L230.261 301.007 88.669 462.799h-78.56l183.455-209.683L0 0h161.999l111.856 147.88L403.229 0zm-27.556 415.805h43.505L138.363 44.527h-46.68l283.99 371.278z"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
