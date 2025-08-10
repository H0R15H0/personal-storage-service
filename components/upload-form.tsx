"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoaderIcon, UploadIcon } from "lucide-react";
import { useState } from "react";

interface UploadFormProps {
  onUploadSuccess: () => void;
}

export function UploadForm({ onUploadSuccess }: UploadFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      // Reset form
      e.currentTarget.reset();
      onUploadSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UploadIcon size="20" />
          ファイルアップロード
        </CardTitle>
        <CardDescription>
          写真や動画を選択してアップロードしてください
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">ファイル</Label>
            <Input
              id="file"
              name="file"
              type="file"
              accept="image/*,video/*"
              disabled={isUploading}
              className="cursor-pointer"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm p-2 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          <Button type="submit" disabled={isUploading} className="w-full">
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