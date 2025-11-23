import { NextResponse } from "next/server";
import { listBlogMetadata } from "@/lib/blogs";

export async function GET() {
  try {
    const posts = await listBlogMetadata();
    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Failed to list blogs", error);
    return NextResponse.json(
      { message: "Failed to load blogs" },
      { status: 500 }
    );
  }
}

export function POST() {
  return NextResponse.json(
    { message: "Databse not hosted yet, feature unavailable" },
    { status: 503 }
  );
}
