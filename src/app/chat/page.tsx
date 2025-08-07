"use client";

import { useState } from "react";
import {
  Server,
  Unplug,
  Settings,
  MoreHorizontal,
  PanelRight,
  CirclePlus,
  ArrowUp,
  ChevronDown,
  SlidersHorizontal,
  Search,
  Rocket,
} from "lucide-react";

interface NotebookCard {
  id: string;
  title: string;
  description: string;
  uses: number;
}

export default function Chat() {
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const notebooks: NotebookCard[] = [
    {
      id: "1",
      title: "تحلیل دلایل از دست رفتن فروش CRM",
      description:
        "این دفترچه دستورالعمل‌های گام به گام برای تحلیل داده‌های دلایل از دست رفتن فروش CRM را ارائه می‌دهد تا الگوهای کلیدی و بینش‌هایی درباره چرایی برنده یا بازنده شدن معاملات شناسایی شود.",
      uses: 1526,
    },
    {
      id: "2",
      title: "تحلیل کارایی کانال‌های جذب مشتری",
      description:
        "تحلیل کارایی کانال‌های جذب مشتری عملکرد و مقرون‌به‌صرفه بودن کانال‌های مختلف بازاریابی مورد استفاده برای جذب مشتریان را ارزیابی می‌کند.",
      uses: 931,
    },
    {
      id: "3",
      title: "آزمون معناداری",
      description:
        "اجرای آزمون معناداری روی ستون‌های یک جدول (مثل t-test، chi-square)",
      uses: 6119,
    },
    {
      id: "4",
      title: "تحلیل بخش‌بندی مشتریان",
      description:
        "تحلیل بخش‌بندی مشتریان، مشتریان را بر اساس ویژگی‌های مشترک، رفتارها و ارزش برای کسب‌وکار گروه‌بندی می‌کند.",
      uses: 1066,
    },
  ];

  const filteredNotebooks = notebooks.filter(
    (notebook) =>
      notebook.title.includes(searchQuery) ||
      notebook.description.includes(searchQuery)
  );

  return (
    <main className="bg-white min-h-screen w-full relative  ">
      {/* Header */}
      <div className="w-full bg-white border-b border-slate-200">
        <div className="flex items-center justify-between gap-2 px-3 py-1.5 sticky top-0 z-100 bg-white">
          <div className="flex items-center gap-1">
            {/* Connected Status */}
            <div className="flex">
              <button className="flex items-center justify-between gap-2 h-8 px-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-green-500 transition-all duration-300">
                <Server className="w-4 h-4 text-green-500" />
                <span className="min-w-[75px] text-center">متصل</span>
                <span className="flex relative w-2 h-2">
                  <span className="absolute flex w-full h-full bg-green-500 rounded-full opacity-75 animate-ping"></span>
                  <span className="relative flex w-2 h-2 bg-green-500 rounded-full"></span>
                </span>
              </button>
            </div>

            <button className="flex items-center justify-between gap-1 h-8 px-3 bg-white border border-gray-200 rounded-lg text-sm font-medium min-w-fit transition-all duration-300">
              <div className="flex pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 44 44"
                  width="16px"
                  height="16px"
                  className="mt-[0.7px]"
                >
                  <linearGradient
                    id="python1"
                    x1="10.458"
                    x2="26.314"
                    y1="12.972"
                    y2="26.277"
                  >
                    <stop offset="0" stopColor="#26abe7" />
                    <stop offset="1" stopColor="#086dbf" />
                  </linearGradient>
                  <path
                    fill="url(#python1)"
                    d="M24.047,5c-1.555,0.005-2.633,0.142-3.936,0.367c-3.848,0.67-4.549,2.077-4.549,4.67V14h9v2 H15.22h-4.35c-2.636,0-4.943,1.242-5.674,4.219c-0.826,3.417-0.863,5.557,0,9.125C5.851,32.005,7.294,34,9.931,34h3.632v-5.104 c0-2.966,2.686-5.896,5.764-5.896h7.236c2.523,0,5-1.862,5-4.377v-8.586c0-2.439-1.759-4.263-4.218-4.672 C27.406,5.359,25.589,4.994,24.047,5z M19.063,9c0.821,0,1.5,0.677,1.5,1.502c0,0.833-0.679,1.498-1.5,1.498 c-0.837,0-1.5-0.664-1.5-1.498C17.563,9.68,18.226,9,19.063,9z"
                  />
                  <linearGradient
                    id="python2"
                    x1="35.334"
                    x2="23.517"
                    y1="37.911"
                    y2="21.034"
                  >
                    <stop offset="0" stopColor="#feb705" />
                    <stop offset="1" stopColor="#ffda1c" />
                  </linearGradient>
                  <path
                    fill="url(#python2)"
                    d="M23.078,43c1.555-0.005,2.633-0.142,3.936-0.367c3.848-0.67,4.549-2.077,4.549-4.67V34h-9v-2 h9.343h4.35c2.636,0,4.943-1.242,5.674-4.219c0.826-3.417,0.863-5.557,0-9.125C41.274,15.995,39.831,14,37.194,14h-3.632v5.104 c0,2.966-2.686,5.896-5.764,5.896h-7.236c-2.523,0-5,1.862-5,4.377v8.586c0,2.439,1.759,4.263,4.218,4.672 C19.719,42.641,21.536,43.006,23.078,43z M28.063,39c-0.821,0-1.5-0.677-1.5-1.502c0-0.833,0.679-1.498,1.5-1.498 c0.837,0,1.5,0.664,1.5,1.498C29.563,38.32,28.899,39,28.063,39z"
                  />
                </svg>
              </div>
            </button>

            {/* Disconnect */}
            <button className="flex items-center gap-1 h-8 px-2 bg-white border border-gray-200 rounded-lg text-sm font-medium transition-all duration-300">
              <div className="flex items-center gap-1">
                <Unplug className="w-4 h-4 stroke-gray-600" />
              </div>
            </button>
          </div>

          {/* Right side controls */}
          <div className="flex items-center h-full justify-center overflow-hidden">
            <div className="flex gap-2">
              <div className="flex items-center min-w-fit">
                <button className="flex items-center justify-center h-8 w-8 rounded-lg transition-all duration-300">
                  <Settings className="w-4 h-4 stroke-gray-600" />
                </button>
                <button className="flex items-center justify-center h-8 w-8 rounded-lg transition-all duration-300">
                  <MoreHorizontal className="w-4 h-4 stroke-gray-600" />
                </button>
                <button className="flex items-center justify-center h-8 w-8 rounded-lg transition-all duration-300">
                  <PanelRight className="w-4 h-4 stroke-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center w-full h-full overflow-x-hidden overflow-y-auto relative z-10">
        <div className="overflow-x-hidden overflow-y-auto w-full">
          <div className="self-center mx-auto max-w-[832px] w-full px-4 pt-8 pb-8">
            <div>
              <h1 className="text-2xl font-bold text-right">
                امروز چه چیزی را می‌خواهید تحلیل کنید؟
              </h1>

              {/* Chat Input Section */}
              <div className="mt-4 -mx-4">
                <div className="flex flex-col gap-2 self-center max-w-full w-full px-4 rounded-t-6">
                  <div className="relative w-full max-w-[832px]">
                    <form className="flex flex-col justify-end relative w-full max-w-full rounded-xl z-60">
                      <div className="flex flex-col relative max-w-full bg-white border border-slate-200 rounded-2xl shadow-sm">
                        <div className="flex items-center w-full px-3 mr-auto ml-auto">
                          <div className="flex items-center justify-center">
                            <div>
                              <button
                                type="button"
                                className="inline-flex items-center justify-center h-6 w-6 rounded-full text-white transition-all duration-300"
                              >
                                <CirclePlus className="w-5 h-5 text-slate-400 transition-colors duration-200" />
                              </button>
                            </div>
                            <input type="file" multiple className="hidden" />
                          </div>

                          <textarea
                            rows={1}
                            placeholder="داده‌ها را متصل کنید و چت را شروع کنید!"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="flex items-center w-full min-h-9 px-2 py-4 text-sm border-none rounded-md resize-none overflow-auto whitespace-pre-wrap text-right outline-none z-40 "
                          />

                          <div>
                            <button
                              type="submit"
                              disabled={!message.trim()}
                              className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium mb-2.5 transition-all duration-300 ${
                                message.trim()
                                  ? "bg-blue-600 text-white cursor-pointer"
                                  : "bg-blue-600 text-white opacity-50 cursor-default pointer-events-none"
                              }`}
                            >
                              <ArrowUp className="w-6 h-6" />
                            </button>
                          </div>
                        </div>

                        {/* Controls Row */}
                        <div className="flex items-center justify-between flex-wrap w-full pt-4 overflow-hidden mb-2 mr-3">
                          <div className="flex items-center flex-grow gap-2 overflow-x-auto overflow-y-hidden rounded-md">
                            {/* Model Selector */}
                            <button className="flex items-center justify-between gap-1 h-6 px-2 bg-white border border-gray-200 rounded-xl text-xs min-w-fit overflow-hidden">
                              <span className="pointer-events-none text-center text-xs">
                                <div className="flex items-center w-full">
                                  <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center w-4 h-4 bg-white text-blue-600 font-bold text-xs">
                                      ج
                                    </div>
                                  </div>
                                  <span className="flex-grow mr-1 overflow-hidden text-ellipsis whitespace-nowrap text-xs">
                                    پیش‌فرض
                                  </span>
                                </div>
                              </span>
                              <span aria-hidden="true">
                                <ChevronDown className="w-4 h-4 stroke-gray-600" />
                              </span>
                            </button>

                            {/* Tools Selector */}
                            <button className="flex items-center justify-between gap-1 h-6 px-1.5 bg-white border border-gray-200 rounded-xl text-xs font-medium min-w-fit overflow-hidden">
                              <SlidersHorizontal className="w-3 h-3 flex-shrink-0 stroke-gray-600" />
                              <div className="flex-basis-0 flex-grow max-w-[100px] overflow-hidden text-center">
                                <span
                                  title="ابزارها"
                                  className="overflow-hidden text-ellipsis whitespace-nowrap text-xs font-medium"
                                >
                                  ابزارها
                                </span>
                              </div>
                              <span aria-hidden="true">
                                <ChevronDown className="w-4 h-4 stroke-gray-600" />
                              </span>
                            </button>

                            {/* Advanced Reasoning Toggle */}
                            <div className="flex items-center">
                              <button
                                type="button"
                                disabled
                                className="flex items-center justify-center h-6 px-3 bg-white border border-gray-200 rounded-xl text-xs font-medium opacity-50 pointer-events-none whitespace-nowrap transition-all duration-150"
                              >
                                <span className="text-xs font-medium pointer-events-none whitespace-nowrap">
                                  استدلال پیشرفته
                                </span>
                              </button>
                            </div>

                            {/* Extended Memory Toggle */}
                            <div className="flex items-center">
                              <button
                                type="button"
                                disabled
                                className="flex items-center justify-center h-6 px-3 bg-white border border-gray-200 rounded-xl text-xs font-medium opacity-50 pointer-events-none whitespace-nowrap transition-all duration-150"
                              >
                                <span className="text-xs font-medium pointer-events-none whitespace-nowrap">
                                  حافظه گسترده
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            {/* Notebooks Section */}
            <div className="mt-8">
              <div className="flex items-center justify-between gap-2 mt-6">
                <h2 className="font-semibold text-right w-full">
                  دفترچه‌هایی برای تحلیل قابل تکرار بسازید
                </h2>
                <div className="rounded-full max-w-[200px] w-full">
                  <div className="relative w-full self-center">
                    <Search className="absolute top-1/2 right-2 w-3.5 h-3.5 text-slate-400 -translate-y-1/2" />
                    <input
                      placeholder="جستجوی دفترچه‌ها..."
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex w-full h-7 px-7 py-1 pr-7 text-xs bg-white border border-gray-200 rounded-lg outline-offset-2 overflow-clip text-right"
                      style={{ direction: "rtl" }}
                    />
                  </div>
                </div>
              </div>

              {/* Notebooks Grid */}
              <div className="grid grid-cols-4 gap-2 mt-2">
                {filteredNotebooks.map((notebook) => (
                  <div
                    key={notebook.id}
                    className="flex flex-col justify-between w-full h-full p-3 pt-2.5 bg-white border border-slate-200 rounded-xl shadow-sm text-right transition-all duration-200 hover:shadow-md"
                  >
                    <div className="flex flex-col items-start justify-between w-full h-full text-right">
                      <div className="flex flex-col justify-start items-start w-full text-sm font-medium text-right">
                        <h1 className="w-full mb-0.5 text-xs font-medium text-right overflow-hidden text-ellipsis whitespace-nowrap">
                          {notebook.title}
                        </h1>
                        <p className="w-full mb-1 max-h-16 flex-grow text-xs text-slate-500 text-right overflow-hidden flow-root">
                          {notebook.description}
                        </p>
                      </div>
                      <button className="appearance-button">
                        <div className="flex justify-start items-center mt-0.5 px-1.5 bg-gray-50 border border-slate-200 rounded-md w-fit text-slate-500 text-xs font-medium">
                          <Rocket className="w-2.5 h-2.5 ml-1 stroke-slate-500" />
                          <span className="text-xs font-medium text-slate-500">
                            {notebook.uses}
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
