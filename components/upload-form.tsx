"use client";

import { LoaderIcon, UploadIcon } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UploadFormProps {
  onUploadSuccess: () => void;
}

export function UploadForm({ onUploadSuccess }: UploadFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File;

    if (!file || file.size === 0) {
      setError("ファイルを選択してください");
      setIsUploading(false);
      return;
    }

    try {
      // First, get the presigned URL
      const uploadData = {
        name: file.name,
        size_bytes: file.size,
        mime_type: file.type || "application/octet-stream",
      };

      const response = await fetch("/api/objects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(uploadData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create object");
      }

      const { upload_url, upload_token } = await response.json();

      // Upload file to Supabase storage using presigned URL
      const uploadResponse = await fetch(upload_url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type || "application/octet-stream",
          Authorization: `Bearer ${upload_token}`,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file to storage");
      }

      // Reset form
      formRef.current?.reset();
      onUploadSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <UploadIcon size="18" className="sm:w-5 sm:h-5" />
          ファイルアップロード
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          写真や動画を選択してアップロードしてください
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file" className="text-sm sm:text-base">
              ファイル
            </Label>
            <Input
              id="file"
              name="file"
              type="file"
              accept="image/*,video/*,.gif,.webp,.apng"
              disabled={isUploading}
              className="cursor-pointer h-11 sm:h-12 text-sm sm:text-base"
            />
          </div>

          {error && (
            <div className="text-red-600 text-xs sm:text-sm p-2 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isUploading}
            className="w-full h-11 sm:h-12 text-sm sm:text-base"
          >
            {isUploading ? (
              <>
                <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
                アップロード中...
              </>
            ) : (
              <>
                <UploadIcon className="w-4 h-4 mr-2" />
                アップロード
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
