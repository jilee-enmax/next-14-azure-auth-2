import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    const session = await auth(); // ✅ Get user session
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accessToken = session.user?.accessToken;
    if (!accessToken) {
      console.error("❌ Access token not found in session:", session);
      return NextResponse.json({ error: "Access token not found" }, { status: 403 });
    }

    const formData = await req.formData();
    const newDisplayName = formData.get("new_display_name") as string;

    if (!newDisplayName || newDisplayName.length < 3) {
      return NextResponse.json(
        { error: "Invalid display name. Must be at least 3 characters long." },
        { status: 400 }
      );
    }

    // Microsoft Graph API endpoint to update display name
    const GRAPH_API_URL = `https://graph.microsoft.com/v1.0/me`;

    console.log("🔄 Updating display name:", { displayName: newDisplayName });

    const response = await fetch(GRAPH_API_URL, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ displayName: newDisplayName }), // ✅ Update display name
    });

    const responseData = await response.text();
    console.log("🔍 Graph API Response:", responseData);

    if (!response.ok) {
      throw new Error(`Graph API Error: ${responseData}`);
    }

    // ✅ Refresh session after update
    revalidatePath("/profile-settings");

    // ✅ Fix redirect issue by using absolute URL
    return NextResponse.redirect(new URL("/profile-settings", req.nextUrl.origin));
  } catch (error) {
    console.error("❌ Graph API Update Failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update display name" },
      { status: 500 }
    );
  }
}
