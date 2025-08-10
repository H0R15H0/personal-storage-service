import { randomUUID } from "node:crypto";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check if user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, size_bytes, mime_type } = await request.json();

    // Validate required fields
    if (!name || size_bytes === undefined || !mime_type) {
      return NextResponse.json(
        { error: "Missing required fields: name, size_bytes, mime_type" },
        { status: 400 }
      );
    }

    // Generate object ID first
    const objectId = randomUUID();

    // Create object record in database
    const { data: objectData, error: dbError } = await supabase
      .from("objects")
      .insert({
        id: objectId,
        user_id: user.id,
        name,
        size_bytes,
        mime_type,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Failed to create object record" },
        { status: 500 }
      );
    }

    // Generate presigned URL for client-side upload
    const { data: signedUrlData, error: signedUrlError } =
      await supabase.storage.from("objects").createSignedUploadUrl(objectId);

    if (signedUrlError) {
      console.error("Signed URL error:", signedUrlError);
      // Clean up the database record if presigned URL generation fails
      await supabase.from("objects").delete().eq("id", objectId);
      return NextResponse.json(
        { error: "Failed to generate upload URL" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: objectData,
      upload_url: signedUrlData.signedUrl,
      upload_token: signedUrlData.token,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
