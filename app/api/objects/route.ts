import { randomUUID } from "crypto";
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

    // Create object record in database
    const { data, error } = await supabase
      .from("objects")
      .insert({
        id: randomUUID(),
        user_id: user.id,
        name,
        size_bytes,
        mime_type,
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to create object" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
