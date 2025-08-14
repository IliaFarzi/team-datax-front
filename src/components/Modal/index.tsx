"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface ModalProps {
  errorMessage: string | null;
  onClose: () => void;
}

export default function Modal({ errorMessage, onClose }: ModalProps) {
  if (!errorMessage) return null;

  const isSuccess = errorMessage.includes("successfully");

  return (
    <Dialog open={!!errorMessage} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-lg shadow-xl border-none bg-white dark:bg-gray-800">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-2">
            {isSuccess ? (
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            ) : (
              <AlertCircle className="h-10 w-10 text-red-500" />
            )}
          </div>
          <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            {isSuccess ? "عملیات موفق" : "خطا"}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {errorMessage}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            بستن
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
