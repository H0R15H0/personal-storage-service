"use client";

import { useRouter } from "next/navigation";
import { UploadForm } from "@/components/upload-form";

export function UploadFormWrapper() {
  const router = useRouter();

  const handleUploadSuccess = () => {
    // Refresh the page to show the new object
    router.refresh();
  };

  return <UploadForm onUploadSuccess={handleUploadSuccess} />;
}