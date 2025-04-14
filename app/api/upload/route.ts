import { NextResponse } from "next/server";
import { uploadImage } from "@/lib/s3";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const isAuthenticated = cookieStore.has("token");

    if (!isAuthenticated) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as "projects" | "articles" | "test";

    if (!file || !folder) {
      return NextResponse.json(
        { message: "File and folder are required" },
        { status: 400 }
      );
    }

    const key = await uploadImage(file, folder);
    return NextResponse.json({ key });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { message: "An error occurred during upload" },
      { status: 500 }
    );
  }
}
