"use client";
import { File, EllipsisVertical, Trash, Upload, Download } from "lucide-react";
import { useCallback, useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type UploadedFile = {
  id: string;
  name: string;
  type: string;
  bucket?: string;
};

type RawFile = {
  _id: string;
  filename: string;
  bucket?: string;
};

function ConnectorsContent() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<UploadedFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  // const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
  const getApiBase = () => {
    const raw = process.env.NEXT_PUBLIC_API_BASE_URL || "";

    if (typeof window !== "undefined") {
      if (/^http:\/\//i.test(raw) && window.location.protocol === "https:") {
        return raw.replace(/^http:\/\//i, "https://");
      }

      if (/^\/\//.test(raw)) {
        return `${window.location.protocol}${raw}`;
      }
    }

    return raw;
  };

  const API_BASE = getApiBase();

  const token = Cookies.get("access_token");

  const fetchUploadedFiles = useCallback(async () => {
    if (!token) {
      setErrorMessage("لطفاً وارد حساب کاربری خود شوید.");
      setUploadedFiles([]);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/files`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const rawFiles = Array.isArray(data) ? data : data.files || [];
        const mappedFiles = rawFiles.map((f: RawFile) => ({
          id: f._id,
          name: f.filename,
          type: f.filename.split(".").pop()?.toLowerCase() || "",
          bucket: f.bucket,
        }));
        setUploadedFiles(mappedFiles);
      } else {
        toast({
          variant: "destructive",
          description: "خطا در بارگیری تاریخچه فایل‌ها",
        });
        setUploadedFiles([]);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "خطا در بارگیری تاریخچه فایل‌ها",
      });
      setUploadedFiles([]);
    }
  }, [API_BASE, token]);

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
      fetchUploadedFiles();
    } else {
      setIsLoggedIn(false);
      setErrorMessage("لطفاً وارد حساب کاربری خود شوید.");
    }
  }, [searchParams, fetchUploadedFiles, token]);

  const handleLabelClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    setSelectedFile(file);
    setIsUploading(true);

    if (!token) {
      setErrorMessage("لطفاً وارد حساب کاربری خود شوید.");
      router.push("/login");
      setSelectedFile(null);
      setIsUploading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadUrl = `${API_BASE}/upload/files`;
      console.log("Full upload URL:", uploadUrl);
      console.log("Token:", token ? "Present" : "Missing");
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      console.log("Upload response status:", response.status);
      console.log("Upload response ok:", response.ok);

      if (response.ok) {
        toast({
          variant: "success",
          description: `فایل ${file.name} با موفقیت آپلود شد.`,
          duration: 3000,
        });
        setSelectedFile(null);
        e.target.value = "";
        await fetchUploadedFiles();
      } else {
        const error = await response
          .json()
          .catch(() => ({ message: "خطا در آپلود فایل" }));
        console.error("Upload error:", error);
        if (response.status === 422) {
          toast({
            variant: "destructive",
            description: "فقط میتونی csv و xls  رو آپلود کنی",
          });
        } else {
          toast({
            variant: "destructive",
            description: error.message || "خطا در آپلود فایل",
          });
        }
      }
    } catch (error) {
      console.error("Upload catch error:", error);
      toast({
        variant: "destructive",
        description: "خطا در آپلود فایل",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleLoginCheck = () => {
    const currentToken = Cookies.get("access_token");
    if (currentToken) {
      setIsLoggedIn(true);
      setErrorMessage(null);
      fetchUploadedFiles();
    } else {
      setErrorMessage("لطفاً وارد حساب کاربری خود شوید.");
      router.push("/login");
    }
  };

  const handleDownloadFile = async (file: UploadedFile) => {
    if (!token) {
      toast({
        variant: "destructive",
        description: "لطفاً وارد حساب کاربری خود شوید.",
      });
      return;
    }

    const downloadUrl = `${API_BASE}/download/files/${encodeURIComponent(
      file.id
    )}`;

    try {
      const response = await fetch(downloadUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        toast({
          variant: "destructive",
          description: "خطا در دانلود فایل",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "خطا در دانلود فایل",
      });
    }
  };

  const handleDeleteFile = async (index: number) => {
    const file = uploadedFiles[index];
    if (!file.id || !token) {
      toast({
        variant: "destructive",
        description: "لطفاً وارد حساب کاربری خود شوید.",
      });
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/delete/files/${file.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        console.log(response);
        toast({
          variant: "success",
          description: `فایل ${file.name} حذف شد.`,
          duration: 3000,
        });
        await fetchUploadedFiles();
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ message: "خطا در حذف فایل" }));
        toast({
          variant: "destructive",
          description: errorData.message || "خطا در حذف فایل",
        });
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        variant: "destructive",
        description: "خطا در حذف فایل",
      });
    }
  };
  const getFileIcon = (fileType: string) => {
    const extension = fileType.toLowerCase();
    if (extension === "pdf") {
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2.4 0C1.07452 0 0 1.07452 0 2.4V17.6C0 18.9255 1.07452 20 2.4 20H17.6C18.9255 20 20 18.9255 20 17.6V2.4C20 1.07452 18.9255 0 17.6 0H2.4ZM3.67509 12.6166C3.75629 12.6722 3.89078 12.7 4.07855 12.7C4.26633 12.7 4.40082 12.6722 4.48201 12.6166C4.56321 12.561 4.61397 12.4902 4.63427 12.4043C4.65457 12.3133 4.66472 12.2198 4.66472 12.1238V11.1307H5.63912C5.85227 11.1307 6.06796 11.0928 6.28618 11.0169C6.50441 10.9361 6.70487 10.8198 6.88757 10.6682C7.07535 10.5115 7.22506 10.3169 7.33671 10.0844C7.45344 9.85194 7.5118 9.58154 7.5118 9.27323C7.5118 8.95986 7.45344 8.68694 7.33671 8.45444C7.22506 8.22195 7.07535 8.02736 6.88757 7.87068C6.70487 7.70894 6.50441 7.59017 6.28618 7.51436C6.07303 7.43854 5.85988 7.40063 5.64673 7.40063H4.08616C3.89839 7.40063 3.7639 7.42843 3.6827 7.48403C3.6015 7.53962 3.55075 7.61291 3.53045 7.70389C3.51015 7.78981 3.5 7.88079 3.5 7.97681V12.1162C3.5 12.2123 3.51015 12.3058 3.53045 12.3967C3.55075 12.4877 3.59896 12.561 3.67509 12.6166ZM5.64673 9.9783H4.66472V8.553H5.63912C5.78122 8.553 5.90555 8.58333 6.01213 8.64398C6.12378 8.70463 6.21006 8.78802 6.27096 8.89416C6.33186 9.0003 6.36231 9.12413 6.36231 9.26564C6.36231 9.43243 6.32424 9.5689 6.24812 9.67504C6.17707 9.78118 6.08572 9.85952 5.97407 9.91006C5.86749 9.95555 5.75838 9.9783 5.64673 9.9783ZM8.18688 12.6166C8.26808 12.6722 8.39749 12.7 8.57512 12.7H9.93015C10.3057 12.7 10.6508 12.6318 10.9654 12.4953C11.2852 12.3588 11.5643 12.1718 11.8028 11.9343C12.0414 11.6917 12.2266 11.4086 12.3585 11.0852C12.4905 10.7566 12.5565 10.4029 12.5565 10.0238C12.5565 9.64977 12.4905 9.30355 12.3585 8.98514C12.2266 8.66672 12.0414 8.38873 11.8028 8.15118C11.5643 7.91364 11.2877 7.72916 10.9731 7.59775C10.6584 7.46634 10.3184 7.40063 9.95298 7.40063H8.58273C8.39495 7.39558 8.26047 7.42085 8.17927 7.47645C8.09807 7.53204 8.04731 7.60533 8.02701 7.69631C8.00671 7.78223 7.99656 7.87321 7.99656 7.96923V12.1162C7.99656 12.2173 8.00925 12.3133 8.03463 12.4043C8.06 12.4902 8.11075 12.561 8.18688 12.6166ZM9.95298 11.5401H9.15367V8.553H9.94537C10.2245 8.553 10.4732 8.6187 10.6914 8.75012C10.9096 8.87647 11.0822 9.05337 11.2091 9.28081C11.3359 9.50825 11.3994 9.76602 11.3994 10.0541C11.3994 10.3422 11.3359 10.5974 11.2091 10.8198C11.0822 11.0422 10.9096 11.2191 10.6914 11.3505C10.4732 11.4769 10.227 11.5401 9.95298 11.5401ZM13.3328 12.6242C13.414 12.6747 13.546 12.7 13.7287 12.7C13.9215 12.7 14.056 12.6747 14.1322 12.6242C14.2134 12.5686 14.2641 12.4978 14.2844 12.4119C14.3047 12.3209 14.3149 12.2274 14.3149 12.1314V10.5317H15.8678C15.9744 10.5317 16.0657 10.5242 16.1419 10.509C16.2231 10.4938 16.2865 10.4534 16.3322 10.3877C16.3779 10.3169 16.4007 10.2007 16.4007 10.0389C16.4007 9.87216 16.3779 9.75338 16.3322 9.68262C16.2865 9.61186 16.2231 9.5689 16.1419 9.55374C16.0657 9.53857 15.9769 9.53099 15.8754 9.53099H14.3149V8.553H15.8138C15.9153 8.553 16.0092 8.54542 16.0955 8.53026C16.1869 8.51003 16.2604 8.4595 16.3163 8.37863C16.3721 8.29776 16.4 8.16635 16.4 7.9844C16.4 7.79233 16.3721 7.65587 16.3163 7.57501C16.2655 7.49413 16.197 7.44612 16.1107 7.43096C16.0245 7.41074 15.9306 7.40063 15.8291 7.40063H13.7515C13.5282 7.40063 13.3734 7.44106 13.2872 7.52194C13.2009 7.6028 13.1578 7.75443 13.1578 7.97681V12.1238C13.1578 12.2198 13.1654 12.3133 13.1806 12.4043C13.2009 12.4953 13.2516 12.5686 13.3328 12.6242Z"
            fill="#DC2626"
          />
        </svg>
      );
    } else if (extension === "doc" || extension === "docx") {
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2.4 0C1.07452 0 0 1.07452 0 2.4V17.6C0 18.9255 1.07452 20 2.4 20H17.6C18.9255 20 20 18.9255 20 17.6V2.4C20 1.07452 18.9255 0 17.6 0H2.4ZM7.4825 13.8157C7.5925 13.889 7.74283 13.9257 7.9335 13.9257C8.13883 13.9257 8.2965 13.8853 8.4065 13.8047C8.52383 13.7167 8.60817 13.6213 8.6595 13.5187C8.71083 13.416 8.74017 13.3463 8.7475 13.3097L10.0125 9.20667L11.2775 13.3097C11.2922 13.3463 11.3215 13.416 11.3655 13.5187C11.4168 13.614 11.5012 13.7057 11.6185 13.7937C11.7358 13.8817 11.8935 13.9257 12.0915 13.9257C12.2968 13.9257 12.4508 13.889 12.5535 13.8157C12.6635 13.7423 12.7405 13.6617 12.7845 13.5737C12.8358 13.4783 12.8688 13.4087 12.8835 13.3647L14.9515 7.36967C15.0102 7.16434 15.0358 6.99933 15.0285 6.87466C15.0285 6.74267 14.9845 6.63267 14.8965 6.54467C14.8085 6.45667 14.6545 6.37233 14.4345 6.29167C14.2292 6.21834 14.0568 6.189 13.9175 6.20367C13.7855 6.21834 13.6755 6.277 13.5875 6.37967C13.5068 6.475 13.4335 6.62534 13.3675 6.83067L12.0035 10.9227L10.8375 6.86367C10.8155 6.81234 10.7825 6.739 10.7385 6.64366C10.6945 6.54833 10.6138 6.46033 10.4965 6.37967C10.3865 6.299 10.2178 6.25867 9.9905 6.25867C9.7925 6.25867 9.6385 6.29533 9.5285 6.36866C9.4185 6.442 9.33783 6.52634 9.2865 6.62167C9.2425 6.717 9.2095 6.80133 9.1875 6.87466L8.0325 10.9007L6.6575 6.81967C6.5915 6.61433 6.5145 6.464 6.4265 6.36866C6.34583 6.27333 6.2395 6.222 6.1075 6.21467C5.98283 6.20734 5.81783 6.23666 5.6125 6.30267C5.29717 6.40533 5.1065 6.53367 5.0405 6.68766C4.9745 6.83433 4.98917 7.06167 5.0845 7.36967L7.1525 13.3647C7.16717 13.4013 7.1965 13.4673 7.2405 13.5627C7.29183 13.658 7.3725 13.7423 7.4825 13.8157Z"
            fill="#1668E3"
          />
        </svg>
      );
    } else if (extension === "xls" || extension === "xlsx") {
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2.4 0C1.07452 0 0 1.07452 0 2.4V17.6C0 18.9255 1.07452 20 2.4 20H17.6C18.9255 20 20 18.9255 20 17.6V2.4C20 1.07452 18.9255 0 17.6 0H2.4ZM12.726 13.8933C12.8507 13.8493 12.9973 13.754 13.166 13.6073C13.4153 13.3946 13.5363 13.204 13.529 13.0353C13.529 12.8666 13.4263 12.6686 13.221 12.4413L11.1043 9.96954L13.221 7.50229C13.4263 7.28229 13.529 7.08428 13.529 6.90829C13.5363 6.73229 13.4153 6.53795 13.166 6.32529C13.0047 6.17129 12.8617 6.07228 12.737 6.02828C12.6123 5.98428 12.4913 5.99162 12.374 6.05029C12.2567 6.10895 12.1283 6.22262 11.989 6.39128L10.0145 8.69697L8.04 6.39128C7.90067 6.22262 7.77233 6.10895 7.655 6.05029C7.53767 5.99162 7.41667 5.98428 7.292 6.02828C7.16733 6.07228 7.02433 6.17129 6.863 6.32529C6.621 6.53795 6.5 6.73229 6.5 6.90829C6.5 7.08428 6.60267 7.28229 6.808 7.50229L8.92471 9.96954L6.808 12.4413C6.60267 12.6686 6.5 12.8666 6.5 13.0353C6.5 13.204 6.621 13.3946 6.863 13.6073C7.03167 13.754 7.17833 13.8493 7.303 13.8933C7.42767 13.9373 7.54867 13.93 7.666 13.8713C7.78333 13.8126 7.908 13.7026 8.04 13.5413L10.0145 11.2398L11.989 13.5413C12.1283 13.7026 12.253 13.8126 12.363 13.8713C12.4803 13.93 12.6013 13.9373 12.726 13.8933Z"
            fill="#2A9D90"
          />
        </svg>
      );
    }
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M2.4 0C1.07452 0 0 1.07452 0 2.4V17.6C0 18.9255 1.07452 20 2.4 20H17.6C18.9255 20 20 18.9255 20 17.6V2.4C20 1.07452 18.9255 0 17.6 0H2.4ZM12.726 13.8933C12.8507 13.8493 12.9973 13.754 13.166 13.6073C13.4153 13.3946 13.5363 13.204 13.529 13.0353C13.529 12.8666 13.4263 12.6686 13.221 12.4413L11.1043 9.96954L13.221 7.50229C13.4263 7.28229 13.529 7.08428 13.529 6.90829C13.5363 6.73229 13.4153 6.53795 13.166 6.32529C13.0047 6.17129 12.8617 6.07228 12.737 6.02828C12.6123 5.98428 12.4913 5.99162 12.374 6.05029C12.2567 6.10895 12.1283 6.22262 11.989 6.39128L10.0145 8.69697L8.04 6.39128C7.90067 6.22262 7.77233 6.10895 7.655 6.05029C7.53767 5.99162 7.41667 5.98428 7.292 6.02828C7.16733 6.07228 7.02433 6.17129 6.863 6.32529C6.621 6.53795 6.5 6.73229 6.5 6.90829C6.5 7.08428 6.60267 7.28229 6.808 7.50229L8.92471 9.96954L6.808 12.4413C6.60267 12.6686 6.5 12.8666 6.5 13.0353C6.5 13.204 6.621 13.3946 6.863 13.6073C7.03167 13.754 7.17833 13.8493 7.303 13.8933C7.42767 13.9373 7.54867 13.93 7.666 13.8713C7.78333 13.8126 7.908 13.7026 8.04 13.5413L10.0145 11.2398L11.989 13.5413C12.1283 13.7026 12.253 13.8126 12.363 13.8713C12.4803 13.93 12.6013 13.9373 12.726 13.8933Z"
          fill="#2A9D90"
        />
      </svg>
    );
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
              accept=".csv,.xls,.xlsx"
              disabled={isUploading}
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
                {isUploading ? "در حال آپلود..." : "برای انتخاب فایل کلیک کنید"}
              </p>

              {selectedFile && !isUploading && (
                <p className="text-xs text-gray-500 mt-1 truncate max-w-full px-4">
                  {selectedFile.name}
                </p>
              )}
            </label>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="mt-6 border border-[#E4E4E7] rounded-md">
              <div className="">
                {uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 border-b last:border-b-0 border-[#E4E4E7] bg-white"
                  >
                    <div className="flex  flex-1">
                      {getFileIcon(file.type)}
                      <span className="text-sm font-medium truncate mr-2 flex-1">
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
                          onClick={() => handleDownloadFile(file)}
                          className="flex items-center justify-between cursor-pointer flex-row-reverse"
                        >
                          دانلود
                          <Download height={18} color="#18181B" />
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setFileToDelete(file);
                            setIsDeleteDialogOpen(true);
                          }}
                          className="flex items-center justify-between cursor-pointer flex-row-reverse"
                        >
                          حذف
                          <Trash height={18} color="#EF4444" />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="sm:max-w-[425px] md:w-500">
          <DialogHeader>
            <DialogTitle>حذف فایل</DialogTitle>
            <DialogDescription>
              آیا مطمئن هستید که می‌خواهید فایل {fileToDelete?.name} را حذف
              کنید؟
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setFileToDelete(null);
              }}
              className="bg-[#FAFAFA] text-[#18181B] w-[50%] hover:bg-gray-100"
            >
              انصراف
            </Button>
            <Button
              type="button"
              onClick={async () => {
                if (fileToDelete) {
                  const index = uploadedFiles.findIndex(
                    (f) => f.id === fileToDelete.id
                  );
                  if (index !== -1) {
                    await handleDeleteFile(index);
                  }
                  setIsDeleteDialogOpen(false);
                  setFileToDelete(null);
                }
              }}
              className="bg-[#DC2626] hover:bg-[#DC2626] w-[50%]"
            >
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
      <Toaster />
    </div>
  );
}
