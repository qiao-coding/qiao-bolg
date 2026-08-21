import { NextRequest } from "next/server";
import { upsertBlogSettings } from "@/lib/blog/blogSettings";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { blogName, homePage, homeIcons, notesSidebar } = body;
    const result = await upsertBlogSettings({ blogName, homePage, homeIcons, notesSidebar });
    return Response.json(result);
  } catch (error) {
    console.error("保存博客设置数据失败:", error);
    return Response.json({ error: "保存数据失败" }, { status: 500 });
  }
}
