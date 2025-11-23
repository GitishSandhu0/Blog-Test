import { NextRequest, NextResponse } from "next/server";
import {
  createBlog,
  listBlogMetadata,
  CreateBlogInput,
} from "@/lib/blogs";

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

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<CreateBlogInput>;
    if (!body.title || !body.summary || !body.content) {
      return NextResponse.json(
        { message: "title, summary, and content are required" },
        { status: 400 }
      );
    }

    const newPost = await createBlog({
      title: body.title,
      summary: body.summary,
      content: body.content,
      publishedAt: body.publishedAt,
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("Failed to create blog", error);
    return NextResponse.json(
      { message: "Failed to create blog" },
      { status: 500 }
    );
  }
}
