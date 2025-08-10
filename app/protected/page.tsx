import { InfoIcon, FileIcon, CalendarIcon, HardDriveIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { FetchDataSteps } from "@/components/tutorial/fetch-data-steps";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UploadFormWrapper } from "./upload-form-wrapper";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  // Fetch user's objects
  const { data: objects, error: objectsError } = await supabase
    .from("objects")
    .select("*")
    .order("created_at", { ascending: false });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
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
    if (mimeType.startsWith("image/")) return { category: "Image", color: "bg-blue-100 text-blue-800" };
    if (mimeType.startsWith("video/")) return { category: "Video", color: "bg-purple-100 text-purple-800" };
    if (mimeType.startsWith("audio/")) return { category: "Audio", color: "bg-green-100 text-green-800" };
    if (mimeType.includes("pdf")) return { category: "PDF", color: "bg-red-100 text-red-800" };
    if (mimeType.includes("text/")) return { category: "Text", color: "bg-gray-100 text-gray-800" };
    return { category: "File", color: "bg-orange-100 text-orange-800" };
  };

  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          This is a protected page that you can only see as an authenticated user
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-3xl">Your Objects</h2>
          <Badge variant="secondary" className="flex items-center gap-2">
            <HardDriveIcon size="14" />
            {objects?.length || 0} objects
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
              <FileIcon className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No objects found</h3>
              <p className="text-muted-foreground text-center">
                You haven&apos;t uploaded any objects yet. Start by uploading your first file.
              </p>
            </CardContent>
          </Card>
        )}

        {objects && objects.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {objects.map((object) => {
              const { category, color } = getMimeTypeCategory(object.mime_type);
              return (
                <Card key={object.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <FileIcon className="w-8 h-8 text-muted-foreground" />
                      <Badge variant="secondary" className={color}>
                        {category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <CardTitle className="text-base truncate" title={object.name}>
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

      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Your user details</h2>
        <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
          {JSON.stringify(data.claims, null, 2)}
        </pre>
      </div>

      <div>
        <h2 className="font-bold text-2xl mb-4">Next steps</h2>
        <FetchDataSteps />
      </div>
    </div>
  );
}
