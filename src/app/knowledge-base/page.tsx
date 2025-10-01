"use client";
import {
  ArrowLeft,
  FileText,
  File,
  EllipsisVertical,
  FilePenIcon,
  Trash,
  Upload,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"; // فرض بر اینه که این کامپوننت‌ها موجودن
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"; // فرض بر اینه که این کامپوننت‌ها موجودن
import { Button } from "@/components/ui/button"; // فرض بر اینه که Button موجوده

type UploadedFile = {
  id: string;
  name: string;
  type: string; // mime type یا extension
  size?: number; // اختیاری
  uploadDate?: string;
};

type Connector = {
  id: string;
  name: string;
  nameFA: string;
  type: string;
  typeFA: string;
  icon: string;
  isNew?: boolean;
};

function ConnectorsContent() {
  const [isConnected, setIsConnected] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Mock: همیشه لاگین باشه
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    // Mock data برای تست
    {
      id: "1",
      name: "sample.pdf",
      type: "pdf",
      size: 1024,
      uploadDate: "2023-10-01",
    },
    {
      id: "2",
      name: "document.docx",
      type: "docx",
      size: 2048,
      uploadDate: "2023-10-02",
    },
    {
      id: "3",
      name: "spreadsheet.xlsx",
      type: "xlsx",
      size: 3072,
      uploadDate: "2023-10-03",
    },
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Mock fetch: فقط mock data رو لود کن
  const fetchUploadedFiles = useCallback(() => {
    // در لوکال، mock data رو استفاده کن
    setUploadedFiles([
      {
        id: "1",
        name: "sample.pdf",
        type: "pdf",
        size: 1024,
        uploadDate: "2023-10-01",
      },
      {
        id: "2",
        name: "document.docx",
        type: "docx",
        size: 2048,
        uploadDate: "2023-10-02",
      },
      {
        id: "3",
        name: "spreadsheet.xlsx",
        type: "xlsx",
        size: 3072,
        uploadDate: "2023-10-03",
      },
    ]);
  }, []);

  useEffect(() => {
    const success = searchParams.get("success");

    // Mock: همیشه لاگین
    setIsLoggedIn(true);
    fetchUploadedFiles(); // Load mock files

    if (success) {
      setIsConnected(true);
      toast({
        variant: "success",
        description: "حساب گوگل شیت شما با موفقیت متصل شد.",
        duration: 3000,
      });
      Cookies.set("google_sheets_connected", "true", {
        expires: 7,
        secure: false,
        sameSite: "Lax",
        path: "/",
      });
    } else {
      const connected = Cookies.get("google_sheets_connected");
      if (connected === "true") {
        setIsConnected(true);
      }
    }
  }, [searchParams, fetchUploadedFiles]);

  const handleLabelClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    setSelectedFile(file);

    // Mock upload: فقط به لیست اضافه کن بدون API
    const newFile: UploadedFile = {
      id: Date.now().toString(), // Mock ID
      name: file.name,
      type: file.name.split(".").pop()?.toLowerCase() || "unknown",
      size: file.size,
      uploadDate: new Date().toISOString().split("T")[0],
    };

    setUploadedFiles((prev) => [...prev, newFile]);

    toast({
      variant: "success",
      description: `فایل ${file.name} با موفقیت آپلود شد (mock).`,
      duration: 3000,
    });

    setSelectedFile(null);
    e.target.value = ""; // Reset input
  };

  const handleLoginCheck = () => {
    // Mock: همیشه OK
    setIsLoggedIn(true);
    setErrorMessage(null);
    fetchUploadedFiles();
  };

  const handleEditFile = (index: number, file: UploadedFile) => {
    // Mock edit
    console.log("Edit file:", file.name);
    toast({
      variant: "default",
      description: `ویرایش فایل ${file.name} (mock)`,
    });
  };

  const handleDeleteFile = (index: number) => {
    // Mock delete
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    toast({
      variant: "success",
      description: `فایل حذف شد (mock).`,
      duration: 3000,
    });
  };

  // Get icon based on file type
  const getFileIcon = (fileType: string) => {
    const extension = fileType.toLowerCase();
    if (extension === "pdf") {
      return <FileText height={20} color="#EF4444" className="mr-2" />; // Red for PDF
    } else if (extension === "doc" || extension === "docx") {
      return <File height={20} color="#3B82F6" className="mr-2" />; // Blue for Word
    } else if (extension === "xls" || extension === "xlsx") {
      return <File height={20} color="#10B981" className="mr-2" />; // Green for Excel
    }
    // Default icon
    return <File height={20} color="#71717A" className="mr-2" />;
  };

  return (
    <div className="w-auto md:w-[50%] mx-auto h-full">
      <div className="space-y-4 ">
        {errorMessage && (
          <div className="text-red-500 text-center mb-4">
            {errorMessage}
            {!isLoggedIn && (
              <button
                onClick={handleLoginCheck}
                className="ml-2 text-blue-500 underline"
              >
                بررسی دوباره وضعیت ورود
              </button>
            )}
          </div>
        )}
        <h2 className="text-xl font-semibold tracking-tight">افزودن فایل</h2>
        <p className="text-[#71717A] text-[14px]">
          محتوای این فایل‌ها در حافظه ایجنت قرار می‌گیرد و هنگام پاسخ‌گویی، برای
          ارائه اطلاعات دقیق‌تر و متناسب با نیاز شما مورد استفاده قرار می‌گیرد.
        </p>
        <div className=" w-full gap-3  overflow-hidden">
          <div className="relative">
            <input
              ref={fileInputRef}
              type="file"
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              onChange={handleFileChange}
            />

            <label
              onClick={handleLabelClick}
              className="h-[154px] flex flex-col justify-center items-center w-full border border-[#E4E4E7] rounded-md cursor-pointer hover:border-gray-400 transition-colors "
            >
              <div className=" mb-2">
                <Upload />
              </div>

              <p className=" text-[14px] font-medium">
                برای انتخاب فایل کلیک کنید
              </p>

              {selectedFile && (
                <p className="text-xs text-gray-500 mt-1 truncate max-w-full px-4">
                  {selectedFile.name}
                </p>
              )}
            </label>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="mt-6 border border-[#E4E4E7] rounded-md">
              <div className="">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 border-b last:border-b-0 border-[#E4E4E7] bg-white"
                  >
                    <div className="flex items-center flex-1">
                      {getFileIcon(file.type)}
                      <span className="text-sm font-medium truncate flex-1">
                        {file.name}
                      </span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <EllipsisVertical
                          height={18}
                          color="#71717A"
                          className="cursor-pointer"
                          aria-label="گزینه‌ها"
                        />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[192px]" align="end">
                        <DropdownMenuItem
                          onClick={() => handleEditFile(index, file)}
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
                              دانلود
                              <Trash height={18} color="#EF4444" />
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px] md:w-500">
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button className="bg-[#FAFAFA] text-[#18181B] w-[50%] ">
                                  انصراف
                                </Button>
                              </DialogClose>
                              <DialogClose asChild>
                                <Button
                                  onClick={() => handleDeleteFile(index)}
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
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Connectors() {
  return (
    <div className="h-screen flex">
      <div className=" px-4 py-3 flex-1 flex flex-col">
        <div className="border-b border-slate-200 pb-1 mb-4 shrink-0">
          <div className="flex justify-between">
            <SidebarTrigger />
            <h1 className="text-[24px] mt-2 flex justify-end md:justify-start font-semibold">
              منابع دانش
            </h1>
          </div>
          <h2 className="hidden md:block mt-2 mb-5 text-[#71717A] ">
            فایل های پیش زمینه خود را به دیتاکس متصل کنید.
          </h2>
        </div>

        <div className="flex-1 max-h-full overflow-hidden">
          <Suspense fallback={<div>در حال بارگذاری...</div>}>
            <ConnectorsContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
