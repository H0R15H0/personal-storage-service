"use client";

import { useState } from "react";
import { UploadIcon, LoaderIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
      setError("Please select a file");
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
          Upload File
        </CardTitle>
        <CardDescription>
          Select a file to create an object record (file content won&apos;t be stored)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">File</Label>
            <Input
              id="file"
              name="file"
              type="file"
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
                Creating object...
              </>
            ) : (
              <>
                <UploadIcon className="w-4 h-4 mr-2" />
                Create Object
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}