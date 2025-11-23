import { NextResponse } from "next/server";
import { getBlogRecord } from "@/lib/blogs";

type Params = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, { params }: Params) {
  const { slug } = await params;
  try {
    const post = await getBlogRecord(slug);
    if (!post) {
      return NextResponse.json(
        { message: "Post not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(post);
  } catch (error) {
    console.error(`Failed to fetch blog ${slug}`, error);
    return NextResponse.json(
      { message: "Failed to load blog" },
      { status: 500 }
    );
  }
}
