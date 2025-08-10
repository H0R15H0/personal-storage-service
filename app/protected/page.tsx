import {
  CalendarIcon,
  FileIcon,
  HardDriveIcon,
  ImageIcon,
  VideoIcon,
} from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { isPhotoFile } from "@/lib/utils";
import { UploadFormWrapper } from "./upload-form-wrapper";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  // Helper function to get thumbnail URLs
  const getThumbnailUrl = async (objectId: string) => {
    const { data, error } = await supabase.storage
      .from("objects")
      .createSignedUrl(objectId, 3600); // 1 hour expiry
    if (error) {
      console.error("Error generating thumbnail URL:", error);
      return null;
    }
    console.log("Thumbnail URL data:", data);
    return data?.signedUrl || null;
  };

  // Fetch user's objects
  const { data: objects, error: objectsError } = await supabase
    .from("objects")
    .select("*")
    .order("created_at", { ascending: false });

  // Fetch thumbnail URLs for photo files
  const objectsWithThumbnails = objects
    ? await Promise.all(
        objects.map(async (object) => ({
          ...object,
          thumbnailUrl: isPhotoFile(object.mime_type)
            ? await getThumbnailUrl(object.id)
            : null,
        }))
      )
    : [];

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getMimeTypeCategory = (mimeType: string) => {
    if (mimeType.startsWith("image/"))
      return {
        category: "画像",
        color: "bg-gradient-to-r from-kpop-pink to-kpop-purple text-white",
      };
    if (mimeType.startsWith("video/"))
      return {
        category: "動画",
        color: "bg-gradient-to-r from-kpop-purple to-kpop-blue text-white",
      };
    if (mimeType.startsWith("audio/"))
      return {
        category: "音声",
        color: "bg-gradient-to-r from-kpop-blue to-kpop-green text-white",
      };
    if (mimeType.includes("pdf"))
      return {
        category: "PDF",
        color: "bg-gradient-to-r from-kpop-green to-kpop-yellow text-white",
      };
    if (mimeType.includes("text/"))
      return {
        category: "テキスト",
        color: "bg-gradient-to-r from-kpop-yellow to-kpop-pink text-white",
      };
    return {
      category: "ファイル",
      color: "bg-gradient-to-r from-primary to-accent text-white",
    };
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/"))
      return <ImageIcon className="w-8 h-8 text-kpop-pink" />;
    if (mimeType.startsWith("video/"))
      return <VideoIcon className="w-8 h-8 text-kpop-purple" />;
    return <FileIcon className="w-8 h-8 text-kpop-blue" />;
  };

  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
          <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl gradient-text animate-float">
            マイストレージ ✨
          </h2>
          <Badge className="flex items-center gap-2 bg-gradient-kpop text-white px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold self-start sm:self-auto">
            <HardDriveIcon size="14" className="sm:w-4 sm:h-4" />
            {objects?.length || 0} ファイル
          </Badge>
        </div>

        <UploadFormWrapper />

        {objectsError && (
          <div className="text-red-600 text-sm p-3 bg-red-50 rounded-md">
            Error loading objects: {objectsError.message}
          </div>
        )}

        {objects && objects.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ImageIcon className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                ファイルがありません
              </h3>
              <p className="text-muted-foreground text-center">
                まだファイルをアップロードしていません。最初の写真や動画をアップロードしてみましょう。
              </p>
            </CardContent>
          </Card>
        )}

        {objectsWithThumbnails && objectsWithThumbnails.length > 0 && (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {objectsWithThumbnails.map((object) => {
              const { category, color } = getMimeTypeCategory(object.mime_type);
              const fileIcon = getFileIcon(object.mime_type);
              const isPhoto = isPhotoFile(object.mime_type);
              return (
                <Card
                  key={object.id}
                  className="glass-effect hover:scale-105 hover:shadow-xl transition-all duration-300 border-0"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="relative">
                        {isPhoto && object.thumbnailUrl ? (
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
                            <Image
                              src={object.thumbnailUrl}
                              alt={`${object.name} thumbnail`}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="p-2 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10">
                            {fileIcon}
                          </div>
                        )}
                      </div>
                      <Badge className={`${color} border-0 shadow-lg`}>
                        {category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <CardTitle
                        className="text-base truncate"
                        title={object.name}
                      >
                        {object.name}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {object.mime_type}
                      </CardDescription>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <HardDriveIcon size="14" />
                        {formatFileSize(object.size_bytes)}
                      </div>
                    </div>

                    {object.created_at && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <CalendarIcon size="12" />
                        {formatDate(object.created_at)}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
